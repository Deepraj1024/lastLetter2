import { Image, Text, View } from 'react-native';

interface PartnerHeaderProps {
  name: string;
  partnerId: string;
}

export default function PartnerHeader({ name, partnerId }: PartnerHeaderProps) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="border-accent items-center justify-center rounded-full border-2">
        <Image
          className="size-16 rounded-full"
          source={require('@/assets/images/agent.png')}
        />
      </View>

      <View className="flex-1">
        <Text className="font-extra-bold text-foreground mb-1 text-2xl capitalize">
          Hi, {name}
        </Text>

        <View className="flex-row gap-1">
          <View className="bg-accent rounded-md px-2 py-1">
            <Text className="text-text text-xs">Chabi Partner</Text>
          </View>

          <View className="border-border bg-background rounded-md border px-2 py-1">
            <Text className="text-accent text-xs">ID : {partnerId}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
