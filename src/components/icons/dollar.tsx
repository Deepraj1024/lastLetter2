import Svg, { Circle, Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Dollar = (props: SvgProps) => {
  const style = useResolveClassNames(cn("size-6", props.className) as string);

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={style}
      viewBox="0 0 24 24"
      {...props}
    >
      <Circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={1.5} />
      <Path
        d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5 3 1.12 3 2.5-1.343 2.5-3 2.5-3-1.12-3-2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
};
