import { Spinner } from 'heroui-native/spinner';
import { View } from 'react-native';

import { Container } from './container';

export const Loading = () => (
  <Container scrollable={false}>
    <View className="flex flex-1 items-center justify-center">
      <Spinner size="lg" />
    </View>
  </Container>
);
