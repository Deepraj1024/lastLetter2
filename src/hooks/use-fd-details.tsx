import { useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';

export const useFdDetails = (userId: string) =>
  useQuery({
    enabled: !!userId,
    queryFn: async () => {
      const response = await baseApi(`/fd-referrals/details/${userId}`, {
        method: 'GET',
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data;
    },
    queryKey: ['fd-details', userId],
  });
