import { useMutation } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';
import type { LoginBodyType } from '@/services/schema/login';

export const useLogin = () =>
  useMutation({
    mutationFn: async (body: LoginBodyType) => {
      const response = await baseApi('/login', {
        body,
        method: 'POST',
      });

      if (response.error) {
        console.log(response.error?.message);
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    mutationKey: ['login'],
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.clear();
    },
  });

export const useLogout = () =>
  useMutation({
    mutationFn: async () => {
      const response = await baseApi('/logout', {
        method: 'POST',
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }

      console.log(response.data);
      return response.data;
    },
    mutationKey: ['logout'],
    onSuccess(_data, _variables, _onMutateResult, context) {
      context.client.clear();
    },
  });
