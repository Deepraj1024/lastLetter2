import { Redirect, router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { SplashScreen } from '@/components/splashScreen';
import { useUserStatus } from '@/hooks/use-user-status';
import { queryClient } from '@/utils/query';
import { clearSession, getToken } from '@/utils/storage';

const LOGIN_ROUTE = '/(app)/(auth)/loginScreen';
const HOME_ROUTE = '/(app)/(protected)/(tabs)/home';
const ONBOARDING_ROUTE = '/(app)/(protected)/onboarding';

const goLogin = () => {
  clearSession();
  queryClient.clear();
  router.replace(LOGIN_ROUTE);
};

/**
 * The single entry gate of the app (route `/`).
 *
 * Verifies the stored session and routes to the right place. EVERY state has
 * an explicit outcome, so the app can never freeze on a blank/splash screen:
 *
 * - no token             -> login
 * - checking the session -> branded splash
 * - session verified     -> home or onboarding (based on user status)
 * - session expired      -> login (the global 401 handler does this)
 * - network/server error -> retry / login screen (never a dead end)
 */
export const SessionGate = () => {
  const token = getToken();
  const {
    data: userStatus,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useUserStatus();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (!token) {
    return <Redirect href={LOGIN_ROUTE} />;
  }

  // While the session is being checked (cold start, or after the user taps
  // "Retry"), show the branded splash instead of a blank screen.
  if (isLoading || isFetching) {
    return <SplashScreen />;
  }

  if (isError) {
    // The global 401 handler already cleared the token and redirected when
    // the session expired, so by the time we are here with an error the
    // token was probably still valid and the failure is network/server
    // related. Never freeze — let the user retry or go to login.
    if (!getToken()) {
      return <Redirect href={LOGIN_ROUTE} />;
    }
    return (
      <View className="bg-background flex-1 items-center justify-center px-8">
        <Text className="text-foreground text-2xl font-bold">
          Can't verify your session
        </Text>
        <Text className="text-foreground/60 mt-3 text-center text-sm">
          We couldn't reach the server. Check your internet connection and try
          again, or log in again.
        </Text>
        <Pressable
          className="bg-accent mt-8 rounded-xl px-10 py-3"
          onPress={handleRetry}
        >
          <Text className="text-background text-base font-bold">Retry</Text>
        </Pressable>
        <Pressable className="mt-4 px-6 py-2" onPress={goLogin}>
          <Text className="text-accent text-base font-medium">Go to Login</Text>
        </Pressable>
      </View>
    );
  }

  const status = userStatus?.agent?.userStatus;

  if (status === 'APPROVED') {
    return <Redirect href={HOME_ROUTE} />;
  }

  if (status === 'NEW_LEAD') {
    return <Redirect href={ONBOARDING_ROUTE} />;
  }

  // Unknown status — do NOT freeze on the splash. Let the protected index
  // decide (it sends APPROVED users to home and everyone else to onboarding).
  return <Redirect href="/(app)/(protected)" />;
};
