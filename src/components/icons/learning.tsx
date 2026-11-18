import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Learning = (props: SvgProps) => {
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
        d="M23.833 9.75 13 5.417 2.167 9.75 13 14.083zm0 0v6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.625}
      />
      <Path
        d="M6.5 11.483v5.85c0 .862.685 1.689 1.904 2.299s2.872.951 4.596.951 3.377-.342 4.596-.951c1.22-.61 1.904-1.437 1.904-2.299v-5.85"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.625}
      />
    </Svg>
  );
};
