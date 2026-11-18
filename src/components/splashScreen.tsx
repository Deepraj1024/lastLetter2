// oxlint-disable-next-line github/filenames-match-regex
import { Spinner } from 'heroui-native/spinner';
import { View } from 'react-native';

export const SplashScreen = () => (
  <View className="bg-background relative flex flex-1 items-center justify-center">
    <Spinner size="lg" />
  </View>
);
