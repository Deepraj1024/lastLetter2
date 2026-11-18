import type { HeroUINativeConfig } from "heroui-native/provider";
import { HeroUINativeProvider } from "heroui-native/provider";
import type { PropsWithChildren } from "react";

const config: HeroUINativeConfig = { devInfo: { stylingPrinciples: false } };

export const HeroUiProvider = (props: PropsWithChildren) => (
  <HeroUINativeProvider config={config}>{props.children}</HeroUINativeProvider>
);
