import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Check = (props: SvgProps) => {
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
        d="M18 1.608A12 12 0 1 1 .006 12.388L0 12l.006-.389A12 12 0 0 1 18 1.608M16.45 8.75a1.2 1.2 0 0 0-1.584-.1l-.113.1-3.952 3.95-1.551-1.55-.113-.1a1.2 1.2 0 0 0-1.684 1.685l.1.112 2.4 2.4.113.1a1.2 1.2 0 0 0 1.47 0l.114-.1 4.8-4.8.1-.113a1.2 1.2 0 0 0-.1-1.584"
        fill="currentColor"
      />
    </Svg>
  );
};
