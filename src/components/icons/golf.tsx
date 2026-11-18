import Svg, { Ellipse, Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Golf = (props: SvgProps) => {
  const style = useResolveClassNames(cn("size-6", props.className) as string);

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={style}
      viewBox="0 0 24 24"
      {...props}
    >
      <Ellipse
        cx={12}
        cy={18.5}
        rx={10}
        ry={3.5}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <Path
        d="M12 18V2m0 1.5 5.422 2.711c1.561.78 2.342 1.171 2.342 1.789s-.78 1.008-2.342 1.789L12 12.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
};
