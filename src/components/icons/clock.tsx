import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Clock = (props: SvgProps) => {
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
        d="M18 1.608A12 12 0 1 1 0 12l.006-.389A12 12 0 0 1 18 1.608M12 4.8A1.2 1.2 0 0 0 10.8 6v6a1.2 1.2 0 0 0 1.2 1.2h4.2a1.2 1.2 0 0 0 0-2.4h-3V6a1.2 1.2 0 0 0-1.06-1.192z"
        fill="currentColor"
      />
    </Svg>
  );
};
