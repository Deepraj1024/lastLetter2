import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Filter = (props: SvgProps) => {
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
        d="M10.972 24v-7.543h2.057V19.2H24v2.057H13.029V24zM0 21.257V19.2h7.543v2.057zm5.486-5.486v-2.743H0v-2.056h5.486V8.229h2.057v7.542zm5.486-2.743v-2.056H24v2.057zm5.485-5.485V0h2.057v2.743H24V4.8h-5.486v2.743zM0 4.8V2.743h13.029V4.8z"
        fill="#fff"
      />
    </Svg>
  );
};
