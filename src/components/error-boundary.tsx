import { router } from 'expo-router';
import { Component } from 'react';
import type { PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';

import { queryClient } from '@/utils/query';
import { clearSession } from '@/utils/storage';

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Last line of defence against a white/blank screen.
 *
 * Without an ErrorBoundary, any error thrown during render (a corrupted
 * storage read, a mismatched API shape, a native module that is not ready,
 * …) unmounts the ENTIRE React tree and the user is left with a blank screen
 * they cannot escape — until they uninstall the app. This boundary shows a
 * simple, recoverable screen instead.
 */
export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // Keep this — it is the only place you will see the real cause in
    // production logs.
    console.error('[ErrorBoundary]', error, info);
  }

  private handleRestart = () => {
    this.setState({ error: null });
    router.reload();
  };

  private handleGoLogin = () => {
    clearSession();
    queryClient.clear();
    this.setState({ error: null });
    router.replace('/(app)/(auth)/loginScreen');
  };

  render() {
    if (this.state.error) {
      return (
        <View className="bg-background flex-1 items-center justify-center px-8">
          <Text className="text-foreground text-2xl font-bold">
            Something went wrong
          </Text>
          <Text className="text-foreground/60 mt-3 text-center text-sm">
            An unexpected error occurred. Please try again.
          </Text>
          <Pressable
            className="bg-accent mt-8 rounded-xl px-10 py-3"
            onPress={this.handleRestart}
          >
            <Text className="text-background text-base font-bold">
              Restart App
            </Text>
          </Pressable>
          <Pressable className="mt-4 px-6 py-2" onPress={this.handleGoLogin}>
            <Text className="text-accent text-base font-medium">
              Go to Login
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
