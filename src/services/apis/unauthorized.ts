import { router } from 'expo-router';

import { queryClient } from '@/utils/query';
import { clearSession, getToken } from '@/utils/storage';

const LOGIN_ROUTE = '/(app)/(auth)/loginScreen';

let isHandlingUnauthorized = false;

export const handleUnauthorized = () => {
  if (!getToken()) {
    return;
  }

  if (isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;

  clearSession();
  queryClient.clear();
  router.replace(LOGIN_ROUTE);

  setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 3000);
};
