import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { G, Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

const AnimatedG = Animated.createAnimatedComponent(G);

export const AnimatedVerifyCheck = ({ className, ...props }: SvgProps) => {
  const resolvedStyle = useResolveClassNames(cn("size-6", className) as string);
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedProps = useAnimatedProps(() => {
    "worklet";
    return {
      transform: [
        { translateX: 12 },
        { translateY: 12 },
        { rotate: `${rotation.value}deg` },
        { translateX: -12 },
        { translateY: -12 },
      ],
    };
  });

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={resolvedStyle}
      viewBox="0 0 24 24"
      {...props}
    >
      <AnimatedG animatedProps={animatedProps}>
        <Path
          d="M9.592 3.2a6 6 0 0 1-.495.399c-.298.2-.633.338-.985.408-.153.03-.313.043-.632.068-.801.064-1.202.096-1.536.214a2.71 2.71 0 0 0-1.655 1.655c-.118.334-.15.735-.214 1.536a6 6 0 0 1-.068.632c-.07.352-.208.687-.408.985-.087.13-.191.252-.399.495-.521.612-.782.918-.935 1.238-.353.74-.353 1.6 0 2.34.153.32.414.626.935 1.238.208.243.312.365.399.495.2.298.338.633.408.985.03.153.043.313.068.632.064.801.096 1.202.214 1.536a2.71 2.71 0 0 0 1.655 1.655c.334.118.735.15 1.536.214.319.025.479.038.632.068.352.07.687.209.985.408.13.087.252.191.495.399.612.521.918.782 1.238.935.74.353 1.6.353 2.34 0 .32-.153.626-.414 1.238-.935.243-.208.365-.312.495-.399.298-.2.633-.338.985-.408.153-.03.313-.043.632-.068.801-.064 1.202-.096 1.536-.214a2.71 2.71 0 0 0 1.655-1.655c.118-.334.15-.735.214-1.536.025-.319.038-.479.068-.632.07-.352.209-.687.408-.985.087-.13.191-.252.399-.495.521-.612.782-.918.935-1.238.353-.74.353-1.6 0-2.34-.153-.32-.414-.626-.935-1.238a6 6 0 0 1-.399-.495 2.7 2.7 0 0 1-.408-.985 6 6 0 0 1-.068-.632c-.064-.801-.096-1.202-.214-1.536a2.71 2.71 0 0 0-1.655-1.655c-.334-.118-.735-.15-1.536-.214a6 6 0 0 1-.632-.068 2.7 2.7 0 0 1-.985-.408 6 6 0 0 1-.495-.399c-.612-.521-.918-.782-1.238-.935a2.71 2.71 0 0 0-2.34 0c-.32.153-.626.414-1.238.935"
          fill="currentColor"
        />
      </AnimatedG>
      <Path
        d="M16.374 9.863a.814.814 0 0 0-1.151-1.151l-4.85 4.85-1.595-1.595a.814.814 0 0 0-1.151 1.151l2.17 2.17a.814.814 0 0 0 1.15 0z"
        fill="#fff"
      />
    </Svg>
  );
};
