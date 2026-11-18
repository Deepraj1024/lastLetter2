import { useMutation, useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';
import {
  type AadharResponse,
  type AadharStatus,
  aadharStatusSchema,
} from '@/services/schema/aadhar';
import { getKycPollIntervalMs } from '@/utils/kyc-poll-interval';

type KycStatus = NonNullable<AadharStatus['kyc_status']>;

export type { KycStatus };

type AadharStatusResponse = AadharStatus;

export interface AadharStartBody {
  name: string;
  phone: string;
}

export const useAadhar = () =>
  useMutation<AadharResponse, Error, AadharStartBody>({
    mutationFn: async (body) => {
      const response = await baseApi<AadharResponse>('/kyc/start', {
        body,
        method: 'POST',
      });

      if (response.error || !response.data) {
        throw new Error(
          response.error?.message ?? 'Failed to start Aadhaar KYC'
        );
      }

      return response.data;
    },
    mutationKey: ['aadhar'],
  });

export const useAadharStatus = (kid?: string) =>
  useQuery<AadharStatusResponse, Error>({
    enabled: !!kid,

    queryFn: async () => {
      if (!kid) {
        throw new Error('Cannot fetch KYC status without a kid');
      }

      const response = await baseApi<AadharStatusResponse>('/kyc/status', {
        method: 'GET',
        query: { kid },
      });

      console.log('aadhar card kyc status:', response.data);

      if (response.data) {
        return response.data;
      }

      // Business failures return a structured body but non-2xx status
      // (e.g. 400 under-age: { success:false, isMinAgeEligible:false,
      // message }). Surface them as data so polling stops and the UI can
      // show the reason instead of an infinite retry loop.
      const failureBody = aadharStatusSchema.safeParse(response.error);
      if (failureBody.success) {
        return failureBody.data;
      }

      // No structured body — a genuine network/server failure.
      const fallbackMessage =
        response.error instanceof Error
          ? response.error.message
          : 'Failed to fetch KYC status';
      throw new Error(fallbackMessage);
    },
    queryKey: ['aadhar-status', kid],

    refetchInterval: (query) => getKycPollIntervalMs(query.state.data),

    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  });
