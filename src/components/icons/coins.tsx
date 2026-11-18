import Svg, { G, Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Coins = (props: SvgProps) => {
  const style = useResolveClassNames(cn("size-6", props.className) as string);

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={style}
      viewBox="0 0 34 34"
      {...props}
    >
      <G
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.083}
      >
        <Path d="M9.33 21.818c0 2.41 3.71 4.363 8.287 4.363s8.288-1.953 8.288-4.363-3.71-4.364-8.288-4.364-8.288 1.954-8.288 4.364" />
        <Path d="M9.33 21.818v5.819c0 2.408 3.71 4.363 8.287 4.363s8.288-1.955 8.288-4.363v-5.819M1.042 10.182c0 1.56 1.58 3 4.143 3.779 2.564.78 5.725.78 8.288 0s4.144-2.22 4.144-3.779c0-1.56-1.58-3-4.144-3.779-2.564-.78-5.724-.78-8.288 0s-4.143 2.22-4.143 3.779" />
        <Path d="M1.042 10.182v14.545c0 1.292 1.066 2.11 2.762 2.91" />
        <Path d="M1.042 17.454c0 1.292 1.066 2.11 2.762 2.91" />
      </G>
    </Svg>
  );
};
