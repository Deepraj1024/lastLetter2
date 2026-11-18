import { useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';
import { getToken } from '@/utils/storage';

export const useUserStatus = () =>
  useQuery({
    enabled: !!getToken(),
    queryFn: async () => {
      const response = await baseApi('/user-status', {
        method: 'GET',
      });

      if (response.error) {
        // Carry the HTTP status on the thrown error so callers can decide
        // how to react (e.g. never retry a 401 — an expired token will not
        // fix itself).
        const error = new Error(
          response.error?.message || 'Failed to fetch user status'
        ) as Error & { status?: number };
        error.status = response.error.status;
        throw error;
      }

      return response.data;
    },
    queryKey: ['user-status'],
    // Don't burn retries on auth failures — the global 401 handler already
    // logged the user out.
    retry: (failureCount, error) => {
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
