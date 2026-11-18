import { useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';

export const useWithdrawl = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi('/withdrawl', {
        method: 'GET',
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }
      return response.data;
    },
    queryKey: ['withdrawl'],
  });

export const useWithdrawlDetail = (id: number) =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi(`@get/withdrawl/${id}`, {
        method: 'GET',
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    queryKey: ['withdrawl', id],
  });
