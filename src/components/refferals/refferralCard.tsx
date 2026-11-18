import type { ImageSource } from "expo-image";
import { ImageBackground } from "expo-image";
import { Card } from "heroui-native/card";
import { Skeleton } from "heroui-native/skeleton";
import { Text, View } from "react-native";

interface LearnHeaderCardProps {
  bgSrc: ImageSource;

  isLoading: boolean;
  title: string;
  totalPoints?: number;
}

export const ReferralCard = ({
  bgSrc,
  isLoading,
  title,
  totalPoints,
}: LearnHeaderCardProps) => (
  <Card className="w-[48%] overflow-hidden rounded-2xl bg-accent p-0">
    <ImageBackground
      contentFit="contain"
      contentPosition="right bottom"
      source={bgSrc}
    >
      <View className="gap-y-2 p-4">
        <View className="flex-row items-center gap-2">
          <Text className="font-bold text-accent-foreground text-base">
            {title}
          </Text>
        </View>

        <Skeleton className="h-8 w-16 rounded-xl" isLoading={isLoading}>
          <Text className="font-bold text-2xl text-foreground">
            {totalPoints ?? 0}
          </Text>
        </Skeleton>
      </View>
    </ImageBackground>
  </Card>
);
