import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const GrowUp = (props: SvgProps) => {
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
        d="M3 21q-.824 0-1.412-.587A1.93 1.93 0 0 1 1 19q0-.824.587-1.413A1.93 1.93 0 0 1 3 17h.263a.6.6 0 0 1 .237.05l4.55-4.55a.6.6 0 0 1-.05-.238V12q0-.825.588-1.412A1.93 1.93 0 0 1 10 10q.825 0 1.412.588Q12 11.175 12 12q0 .05-.05.5l2.55 2.55a.6.6 0 0 1 .238-.05h.524a.6.6 0 0 1 .238.05l3.55-3.55a.6.6 0 0 1-.05-.238V11q0-.825.587-1.412A1.93 1.93 0 0 1 21 9q.824 0 1.413.588Q23 10.175 23 11t-.587 1.412A1.93 1.93 0 0 1 21 13h-.262a.6.6 0 0 1-.238-.05l-3.55 3.55a.6.6 0 0 1 .05.238V17q0 .824-.587 1.413A1.93 1.93 0 0 1 15 19q-.825 0-1.412-.587A1.93 1.93 0 0 1 13 17v-.262a.6.6 0 0 1 .05-.238l-2.55-2.55a.6.6 0 0 1-.238.05H10q-.05 0-.5-.05L4.95 18.5a.6.6 0 0 1 .05.238V19q0 .824-.588 1.413A1.93 1.93 0 0 1 3 21m1-10.025-.625-1.35L2.025 9l1.35-.625L4 7.025l.625 1.35L5.975 9l-1.35.625zM15 10l-.95-2.05L12 7l2.05-.95L15 4l.95 2.05L18 7l-2.05.95z"
        fill="#fff"
      />
    </Svg>
  );
};
