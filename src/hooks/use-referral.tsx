import { useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';

export const useReferral = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi('/referrals-summary', {
        method: 'GET',
        params: {
          filter: 'monthly',
        },
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }
      console.log(response.data);
      return response.data;
    },
    queryKey: ['referral'],
  });
