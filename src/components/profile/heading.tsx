import type { PropsWithChildren } from "react";
import { Text } from "react-native";

type ProfileHeadingProps = PropsWithChildren<{
  label?: string;
  delay?: number;
}>;

export const ProfileHeading = (props: ProfileHeadingProps) => (
  <Text
    className="text-base text-foreground"
    // entering={SlideInRight.delay(props?.delay ?? 100)
    //   .duration(300)
    //   .springify()}
  >
    {props.label ?? props.children}
  </Text>
);
