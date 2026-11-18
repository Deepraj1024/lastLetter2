import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Siren = (props: SvgProps) => {
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
        d="M20 22v-6a8 8 0 1 0-16 0v6"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <Path
        d="M14.29 11.5a4 4 0 0 1 2.21 2.21M2 22h20M12 2v3m9 1-1.5 1.5M3 6l1.5 1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
      <Path
        d="M13.5 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <Path
        d="M12 19v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
};
