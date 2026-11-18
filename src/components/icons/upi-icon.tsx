import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const UpiIcon = (props: SvgProps) => {
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
        clipRule="evenodd"
        d="M23.41 15.435 8.58 29l1.423-4.962a.84.84 0 0 1 1.04-.577.84.84 0 0 1 .554.5l10.201-9.328-4.737-9.109-.02.07a.843.843 0 0 1-1.62-.462L16.606 1l6.984 13.43a.84.84 0 0 1-.18 1.005m-14.147 5.67 7.28-6.658-3.46-6.66zM6 26.37l12.632-11.554L12.63 3.26z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </Svg>
  );
};
