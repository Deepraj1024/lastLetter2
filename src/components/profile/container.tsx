import { useRouter } from "expo-router";
import { Button } from "heroui-native/button";
import type { ComponentProps, FC } from "react";
import { View } from "react-native";
import Animated, {
  FadeInLeft,
  FadeInUp,
  FadeOutLeft,
  FadeOutUp,
} from "react-native-reanimated";
import type { ClassNameValue } from "tailwind-merge";
import { cn } from "@/utils/style";
import { Container } from "../container";
import { ArrowLeft } from "../icons/arrow-left";
import { Info } from "../icons/info";

type BaseContainerProps = ComponentProps<typeof Container>;

type ProfileContainerProps = BaseContainerProps & {
  title?: string;
  rightAction?: boolean;
  rightActionComponent?: FC;
  onRightActionPress?: () => void;
  onBackPress?: () => void;
  headerClassName?: ClassNameValue;
};

export const ProfileContainer = (props: ProfileContainerProps) => {
  const router = useRouter();

  return (
    <Container
      {...props}
      className={cn("pt-safe-offset-2 pb-safe", props.className)}
      scrollable={props.scrollable ?? true}
    >
      <View
        className={cn(
          "flex flex-row items-center justify-between px-4",
          props.headerClassName
        )}
      >
        {router.canGoBack() ? (
          <Animated.View
            entering={FadeInLeft.delay(150).springify()}
            exiting={FadeOutLeft.delay(150).springify()}
          >
            <Button
              className="bg-surface"
              isIconOnly
              onPress={() => {
                if (props.onBackPress) {
                  props.onBackPress();
                } else {
                  router.back();
                }
              }}
              variant="ghost"
            >
              <ArrowLeft className="size-6 text-foreground" />
            </Button>
          </Animated.View>
        ) : (
          <View className="size-6" />
        )}
        {props?.title ? (
          <Animated.Text
            className="flex flex-1 text-center font-medium text-foreground text-xl"
            entering={FadeInUp.delay(100).springify()}
            exiting={FadeOutUp.delay(100).springify()}
          >
            {props.title}
          </Animated.Text>
        ) : null}

        {props.rightActionComponent ? <props.rightActionComponent /> : null}

        {props.rightAction && (
          <Button
            className="bg-surface"
            isIconOnly
            onPress={props.onRightActionPress}
            variant="ghost"
          >
            <Info className="size-6 text-foreground" />
          </Button>
        )}

        {!(props.rightAction || props.rightActionComponent) && (
          <View className="size-8" />
        )}
      </View>
      {/* <Animated.Image
        className="absolute top-0 left-0 -z-10 w-full"
        entering={FadeInUp.duration(1000)}
        exiting={FadeOutUp.duration(1000)}
        source={require("@/assets/images/rupee.png")}
      /> */}
      {props.children}
    </Container>
  );
};
