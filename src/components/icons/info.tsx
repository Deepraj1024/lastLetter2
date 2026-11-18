import Svg, { Circle, Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Info = (props: SvgProps) => {
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
        d="M12 17v-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
      <Circle
        cx={1}
        cy={1}
        fill="currentColor"
        r={1}
        transform="matrix(1 0 0 -1 11 9)"
      />
    </Svg>
  );
};
