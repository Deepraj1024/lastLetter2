import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Calendar = (props: SvgProps) => {
  const style = useResolveClassNames(cn("size-6", props.className) as string);

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={style}
      viewBox="0 0 24 24"
      {...props}
    >
      <Path
        d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <Path
        d="M7 4V2.5M17 4V2.5M2.5 9h19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
      <Path
        d="M18 17a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
        fill="currentColor"
      />
    </Svg>
  );
};
