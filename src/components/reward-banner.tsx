import type { ImageSource } from 'expo-image';
import { Image, ImageBackground } from 'expo-image';
import { Text, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Coins } from '@/components/icons/coins';

import { Building } from './icons/building';

interface RewardBannerProps {
  badge: ImageSource;
  digitalGold: string;
  fixedDeposit: string;
  source: ImageSource;
  subTitle: string;
  title: string;
}

export default function RewardBanner({
  badge,
  source,
  title,
  subTitle,
  digitalGold,
  fixedDeposit,
}: RewardBannerProps) {
  return (
    <View className="mb-5 overflow-hidden rounded-[30px]">
      <ImageBackground
        className="h-48 w-full"
        contentFit="cover"
        source={source}
      >
        {/* Header */}
        <View className="flex-row items-center px-3 py-3">
          <Image
            contentFit="contain"
            source={badge}
            style={{
              height: 54,
              width: 54,
            }}
          />

          <View className="ml-2 flex-1">
            <Text className="text-foreground text-xl font-extrabold">
              {title}
            </Text>
            <Text className="text-foreground/80 text-xs font-medium">
              {subTitle}
            </Text>
          </View>
        </View>

        <View className="mt-auto p-4">
          <View className="flex-row items-center">
            <View className="flex-1 flex-row items-center gap-2">
              <Icon
                color="foreground"
                icon={Coins}
                size="sm"
                variants="soft"
                withWrapper={false}
              />

              <Text className="text-foreground/80 flex-1 text-xs leading-5 font-medium">
                {digitalGold}
              </Text>
            </View>

            <View className="flex-1 flex-row items-center gap-2">
              <Icon
                color="foreground"
                icon={Building}
                size="sm"
                variants="soft"
                withWrapper={false}
              />

              <Text className="text-foreground/80 flex-1 text-xs leading-5 font-medium">
                {fixedDeposit}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
