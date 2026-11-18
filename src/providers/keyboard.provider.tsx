import type { PropsWithChildren } from "react";
import { KeyboardProvider as Provider } from "react-native-keyboard-controller";

export const KeyboardProvider = (props: PropsWithChildren) => (
  <Provider>{props.children}</Provider>
);
