import '../../global.css';
import * as Network from 'expo-network';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'expo-router/react-navigation';
import { useEffect, useState } from 'react';
import { initializeChottuLink } from 'react-native-chottulink-sdk';

import { ErrorBoundary } from '@/components/error-boundary';
import { NoInternet } from '@/components/no-network';
import { AppProviders } from '@/providers';
import { useNativeTheme } from '@/styles/native-theme';

const StackLayout = () => {
  const theme = useNativeTheme();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    initializeChottuLink(process.env.EXPO_PUBLIC_CHOTTU_LINK_API_KEY ?? '');

    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();

      setIsConnected(state.isConnected ?? false);
    };

    checkNetwork();

    const subscription = Network.addNetworkStateListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ThemeProvider value={theme}>
      {!isConnected && <NoInternet />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
      </Stack>
    </ThemeProvider>
  );
};

export default function Layout() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <StackLayout />
      </AppProviders>
    </ErrorBoundary>
  );
}
