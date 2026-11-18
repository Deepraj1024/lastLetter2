import { useMutation, useQuery } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';
import { responseSchema } from '@/services/schema/common';

export const useUpis = () =>
  useMutation({
    mutationFn: async (body: { upi_id: string; is_primary: boolean }) => {
      const response = await baseApi('/upis', {
        body,
        method: 'POST',
      });
      if (response.error) {
        console.log(response);

        throw new Error(response.error?.message);
      }
      console.log('upis post', response);

      return response.data;
    },
    mutationKey: ['upis'],
  });
export const useUpisList = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi('@get/upis', {
        method: 'GET',
      });
      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    queryKey: ['upis-list'],
  });
export const useUpiUpdate = () =>
  useMutation({
    mutationFn: async (body: { upi_id: string; is_primary: boolean }) => {
      const response = await baseApi('@put/upis', {
        body,
        method: 'PUT',
      });
      console.log(response);
      if (response.error) {
        throw new Error(response.error?.message);
      }
      console.log(response);

      return response.data;
    },
    mutationKey: ['upis-update'],
  });
