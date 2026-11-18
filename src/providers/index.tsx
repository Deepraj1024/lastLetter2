import type { PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppVersionProvider } from './app-version.provider';
import { HeroUiProvider } from './heroui.provider';
import { KeyboardProvider } from './keyboard.provider';
import { QueryProvider } from './query.provider';

export const AppProviders = (props: PropsWithChildren) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <KeyboardProvider>
      <HeroUiProvider>
        <QueryProvider>
          <AppVersionProvider>{props.children}</AppVersionProvider>
        </QueryProvider>
      </HeroUiProvider>
    </KeyboardProvider>
  </GestureHandlerRootView>
);
