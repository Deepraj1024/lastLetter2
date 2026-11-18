import { useMutation } from '@tanstack/react-query';

import { baseApi } from '@/services/apis';

export const usePanCard = () =>
  useMutation({
    mutationFn: async (body: { panNumber: string }) => {
      console.log('🚀 PAN REQUEST');
      console.log('Endpoint:', '/kyc');
      console.log('Method:', 'POST');
      console.log('Body:', JSON.stringify(body, null, 2));

      const response = await baseApi('/kyc', {
        body,
        method: 'POST',
      });

      console.log('📥 PAN RESPONSE');
      console.log('Full Response:', response);
      console.log('Response Data:', response?.data);
      console.log('Response Error:', response?.error);
      console.log('Status:', response?.status);

      if (response?.error) {
        console.log('❌ PAN API ERROR');
        console.log('Message:', response.error.message);
        console.log('Error Object:', response.error);

        throw new Error(response.error.message);
      }

      console.log('✅ PAN VERIFIED SUCCESSFULLY');

      return response.data;
    },
    mutationKey: ['panCard'],
  });
