import Svg, { ClipPath, Defs, G, Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Biometric = (props: SvgProps) => {
  const style = useResolveClassNames(cn("size-6", props.className) as string);

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={style}
      viewBox="0 0 30 30"
      {...props}
    >
      <G
        clipPath="url(#a)"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.938}
      >
        <Path d="M23.625 8.75A10 10 0 0 1 25 15v1.25A7.5 7.5 0 0 0 26 20m-16-6.25a5 5 0 1 1 10 0V15a12.5 12.5 0 0 0 2.5 7.5" />
        <Path d="M15 13.75v2.5a17.5 17.5 0 0 0 3.125 10M10 18.75a22.5 22.5 0 0 0 2.25 7.5m-6.125-2.5A27.5 27.5 0 0 1 5 15v-1.25a10 10 0 0 1 15-8.688" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path d="M0 0h30v30H0z" fill="currentColor" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
