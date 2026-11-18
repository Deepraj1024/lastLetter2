import { useQuery } from '@tanstack/react-query';
// oxlint-disable-next-line sonarjs/no-wildcard-import
import * as Application from 'expo-application';
import { Platform } from 'react-native';

import { baseApi } from '@/services/apis';
import { APP_VERSION_PLATFORM } from '@/services/schema/common';

const FALLBACK_BUNDLE_ID = 'com.chabi.app';
const APP_VERSION_STALE_MS = 5 * 60 * 1000;

const resolvePlatform = () =>
  Platform.OS.toLowerCase() === APP_VERSION_PLATFORM.IOS
    ? APP_VERSION_PLATFORM.IOS
    : APP_VERSION_PLATFORM.ANDROID;

export const useAppVersion = () => {
  const bundleId = Application.applicationId ?? FALLBACK_BUNDLE_ID;
  const platform = resolvePlatform();
  const localVersion = Application.nativeApplicationVersion ?? '0.0.0';
  const localVersionCode = Number(Application.nativeBuildVersion ?? 0);

  const query = useQuery({
    queryFn: async () => {
      const response = await baseApi('/app-versions', {
        query: { bundleId, platform },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data.data;
    },
    queryKey: ['app-version', bundleId, platform],
    staleTime: APP_VERSION_STALE_MS,
  });

  const remoteVersion = query.data;
  const needsUpdate = Boolean(
    remoteVersion && localVersionCode < remoteVersion.versionCode
  );

  return {
    bundleId,
    isPending: query.isPending,
    localVersion,
    localVersionCode,
    needsUpdate,
    platform,
    refetch: query.refetch,
    remoteVersion,
  };
};
