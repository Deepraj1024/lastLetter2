import * as Application from 'expo-application';
import { useCallback, useState } from 'react';
import { Alert, Platform, Text, ToastAndroid, View } from 'react-native';

import { UserOutline } from '@/components/icons/user-outline';
import { Profile } from '@/components/profile';
import { useAppVersion } from '@/hooks/use-app-version';

const APP_VERSION = Application.nativeApplicationVersion ?? '1.0.0';
const BUILD_NUMBER = Application.nativeBuildVersion ?? '1';
const APP_NAME = 'Chabi-Partner';
const BUNDLE_ID = Application.applicationId ?? 'com.chabi.app';

const showToast = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('App Update', message);
  }
};

export default function About() {
  const { remoteVersion, refetch } = useAppVersion();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckForUpdate = useCallback(async () => {
    if (isChecking) {
      return;
    }
    setIsChecking(true);

    try {
      // Fetch latest version from API
      const result = await refetch();
      const latestVersion =
        (typeof result?.data === 'string'
          ? result.data
          : result?.data?.version) ??
        (typeof remoteVersion === 'string'
          ? remoteVersion
          : remoteVersion?.version);

      if (!latestVersion) {
        showToast('Unable to check for updates.');
        return;
      }

      // Compare versions
      if (APP_VERSION === latestVersion) {
        showToast('Your app is up to date!');
      } else {
        // When update is available → refetch again to ensure latest data
        await refetch();
        showToast(`Update available: v${latestVersion}`);
      }
    } catch (error) {
      console.error('Update check failed:', error);
      showToast('Failed to check for updates.');
    } finally {
      setIsChecking(false);
    }
  }, [isChecking, refetch, remoteVersion]);

  return (
    <Profile.Container title="About App">
      <View className="flex-1 items-center justify-center px-5">
        <View className="bg-surface w-full rounded-3xl px-5 py-3">
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-foreground text-base">App Name</Text>
            <Text className="text-foreground text-base font-medium">
              {APP_NAME}
            </Text>
          </View>
          <View className="bg-border h-px w-full" />
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-foreground text-base">Version</Text>
            <Text className="text-foreground text-base font-medium">
              {APP_VERSION}
            </Text>
          </View>
          <View className="bg-border h-px w-full" />
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-foreground text-base">Build Number</Text>
            <Text className="text-foreground text-base font-medium">
              {BUILD_NUMBER}
            </Text>
          </View>
          <View className="bg-border h-px w-full" />
          <View className="flex-row items-center justify-between py-4">
            <Text className="text-foreground text-base">Bundle ID</Text>
            <Text className="text-foreground text-right text-sm font-medium">
              {BUNDLE_ID}
            </Text>
          </View>
        </View>
        <View className="mt-4 w-full">
          <Profile.Tile
            icon={<UserOutline className="text-accent" />}
            onPress={handleCheckForUpdate}
            title={isChecking ? 'Checking...' : 'Check For Update'}
          />
        </View>
      </View>
    </Profile.Container>
  );
}
