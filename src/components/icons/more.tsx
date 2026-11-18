import Svg, { Circle, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const More = (props: SvgProps) => {
  const style = useResolveClassNames(cn("size-6", props.className) as string);

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={style}
      viewBox="0 0 24 24"
      {...props}
    >
      <Circle cx={5} cy={12} r={2} stroke="currentColor" strokeWidth={1.5} />
      <Circle cx={12} cy={12} r={2} stroke="currentColor" strokeWidth={1.5} />
      <Circle cx={19} cy={12} r={2} stroke="currentColor" strokeWidth={1.5} />
    </Svg>
  );
};
