import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { AltArrowRight } from "../icons/alt-arrow-right";

interface TileProps {
  description?: string;
  href?: Href;
  icon: ReactNode;
  onPress?: () => void;
  title: string;
}

export const ProfileTile = (props: TileProps) => {
  const router = useRouter();

  const onNavigate = () => {
    if (props?.href) {
      router.navigate(props.href);
    } else if (props?.onPress) {
      props.onPress();
    }
  };

  return (
    <PressableFeedback
      className="flex flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4"
      onPress={onNavigate}
    >
      <View className="flex flex-row items-center gap-x-3">
        {/* <View className="size-10 items-center justify-center rounded-full border border-border bg-background p-1"> */}
        {props.icon}
        {/* </View> */}
        <View className="w-4/5">
          <Text
            className="font-medium text-base text-foreground"
            numberOfLines={1}
          >
            {props.title.length > 30
              ? `${props.title.slice(0, 30)}...`
              : props.title}
          </Text>
          {/* <Text className="text-foreground/60">{props.description}</Text> */}
        </View>
      </View>
      <AltArrowRight className="text-accent" />
    </PressableFeedback>
  );
};
