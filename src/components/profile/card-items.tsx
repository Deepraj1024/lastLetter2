import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Card } from "heroui-native/card";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import type { PropsWithChildren, ReactNode } from "react";
import { Text, View } from "react-native";

interface CardItemProps {
  delay?: number;
  href: Href;
  icon: ReactNode;
  title: string;
}

export const ProfileWrapper = (props: PropsWithChildren) => (
  // <Animated.View entering={FadeInRight.delay(130).duration(500).springify()}>
  <Card className="border border-border">
    <Card.Body className="flex flex-row items-center px-2 py-3">
      {props.children}
    </Card.Body>
  </Card>
  // </Animated.View>
);

export const ProfileWrapperItem = (props: CardItemProps) => (
  <View
    className="min-w-0 flex-1 items-center justify-center gap-y-3"
    // entering={ZoomIn.delay(props.delay ?? 300)
    //   .duration(500)
    //   .springify()}
  >
    <Link asChild href={props.href}>
      <PressableFeedback className="items-center justify-center gap-y-2">
        {props.icon}

        <Text className="w-full text-center text-foreground text-xs">
          {props.title}
        </Text>
      </PressableFeedback>
    </Link>
  </View>
);
