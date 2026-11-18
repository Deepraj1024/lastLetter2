import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';
import type { Profile, UpdateProfile } from '@/services/schema/profile';
import { getToken } from '@/utils/storage';

export const useProfile = () => {
  const token = getToken();

  return useQuery({
    enabled: !!token,
    queryFn: async (): Promise<Profile> => {
      const response = await baseApi<Profile>('/profile', {
        method: 'GET',
      });

      if (response.error || !response.data) {
        console.log(response.error.message);

        throw new Error(response.error?.message || 'Failed to fetch profile');
      }

      console.log('profile data:', response);

      return response.data;
    },
    queryKey: ['profile'],
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfile): Promise<Profile> => {
      const response = await baseApi<Profile>('@put/profile', {
        body: data,
        method: 'PUT',
      });

      if (response.error || !response.data) {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
      console.log('profile', response.data);

      return response.data;
    },
    onError: (error: Error) => {
      console.error('Update failed:', error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
