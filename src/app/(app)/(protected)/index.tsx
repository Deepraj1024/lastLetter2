import { Redirect } from 'expo-router';

import { SplashScreen } from '@/components/splashScreen';
import { useUserStatus } from '@/hooks/use-user-status';

export default function Index() {
  const { data: userStatus, isLoading } = useUserStatus();

  // Show the branded splash while checking — never a bare `null` (blank).
  if (isLoading) {
    return <SplashScreen />;
  }

  if (userStatus?.agent?.userStatus === 'APPROVED') {
    return <Redirect href="/(app)/(protected)/(tabs)/home" />;
  }

  return <Redirect href="/(app)/(protected)/onboarding" />;
}
