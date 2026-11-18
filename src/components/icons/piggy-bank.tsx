import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const PiggyBank = (props: SvgProps) => {
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
        d="M16.8 11.368q.51 0 .855-.363t.345-.9-.345-.9a1.13 1.13 0 0 0-.855-.363q-.51 0-.855.363t-.345.9.345.9.855.363M7.2 8.842h6V6.316h-6zM3 24a1129 1129 0 0 1-2.01-7.184A27.5 27.5 0 0 1 0 9.474q0-2.906 1.92-4.927t4.68-2.02h6A6.2 6.2 0 0 1 14.715.662 5.6 5.6 0 0 1 17.4 0q.75 0 1.275.553a1.88 1.88 0 0 1 .48 1.72q-.045.19-.105.348-.12.348-.225.71-.105.364-.165.743l2.73 2.873H24v8.81l-3.39 1.17L18.6 24H12v-2.526H9.6V24zm1.8-2.526h2.4v-2.527h7.2v2.527h2.4l1.86-6.506 2.94-1.042V9.474h-1.2l-4.2-4.421a9.6 9.6 0 0 1 .3-2.4q-.87.252-1.53.868-.66.615-.96 1.532H6.6q-1.74 0-2.97 1.294Q2.4 7.643 2.4 9.474q0 3.095.81 6.047a461 461 0 0 1 1.59 5.953"
        fill="#4fbffb"
      />
    </Svg>
  );
};
