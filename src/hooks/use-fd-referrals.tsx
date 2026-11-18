import { useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';

export const useFdReferral = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi('/fd-referrals', {
        method: 'GET',
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }
      console.log(response.data);
      return response.data;
    },
    queryKey: ['fd-referral'],
  });
