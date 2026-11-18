import type { PropsWithChildren, ReactElement } from "react";
import type { RefreshControlProps, ViewProps } from "react-native";
import { ScrollView, View } from "react-native";

import { cn } from "@/utils/style";

interface Props extends ViewProps {
  className?: string;
  refreshControl?: ReactElement<RefreshControlProps>;
  scrollable?: boolean;
}

export const Container = (props: PropsWithChildren<Props>) => (
  <View className={cn("flex-1 bg-background", props?.className)}>
    {(props?.scrollable ?? true) ? (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={props?.refreshControl}
      >
        {props?.children}
      </ScrollView>
    ) : (
      props?.children
    )}
  </View>
);
