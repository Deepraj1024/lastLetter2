import { Typography } from 'heroui-native/text';
import { View } from 'react-native';

export const NoInternet = () => (
  <View className="absolute inset-x-0 top-0 z-50" pointerEvents="none">
    <View className="bg-danger pt-safe-offset-1 items-center px-4 pb-2">
      <Typography.Paragraph
        className="text-danger-foreground"
        type="body-sm"
        weight="semibold"
      >
        No internet connection
      </Typography.Paragraph>
    </View>
  </View>
);
