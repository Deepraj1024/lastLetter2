import type { PropsWithChildren } from 'react';

import { ForceUpdate } from '@/components/force-update';
import { useAppVersion } from '@/hooks/use-app-version';

export const AppVersionProvider = (props: PropsWithChildren) => {
  const { localVersion, needsUpdate, remoteVersion } = useAppVersion();

  console.log('app update', localVersion, needsUpdate, remoteVersion);

  if (needsUpdate && remoteVersion) {
    return (
      <ForceUpdate localVersion={localVersion} remoteVersion={remoteVersion} />
    );
  }
  return props.children;
};
