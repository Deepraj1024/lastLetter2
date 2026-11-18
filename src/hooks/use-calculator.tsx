import { useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';

export const useCalcutaion = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi('/commission-calculator/percentage', {
        method: 'GET',
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    queryKey: ['calculator'],
  });
