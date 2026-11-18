import Svg, { G, Mask, Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const Close = (props: SvgProps) => {
  const style = useResolveClassNames(cn("size-6", props.className) as string);

  return (
    <Svg
      color="currentColor"
      fill="none"
      style={style}
      viewBox="0 0 24 24"
      {...props}
    >
      <Mask
        height={24}
        id="a"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
        width={24}
        x={0}
        y={0}
      >
        <Path
          d="m12 0 .389.001.381.005.74.02.358.016.695.04.664.056c5.742.557 8.078 2.893 8.635 8.635l.055.664.041.695q.01.176.016.358l.02.74L24 12l-.006.77-.02.74-.016.358-.04.695-.056.664c-.557 5.742-2.893 8.078-8.635 8.635l-.664.055-.695.041q-.176.01-.358.016l-.74.02L12 24l-.77-.006-.74-.02-.358-.016-.695-.04-.664-.056C3.031 23.305.695 20.969.138 15.227l-.055-.664-.041-.695-.016-.358-.02-.74A54 54 0 0 1 0 12l.001-.389.005-.381.02-.74.016-.358.04-.695.056-.664C.695 3.031 3.031.695 8.773.138l.664-.055.695-.041q.176-.01.358-.016l.74-.02Q11.608 0 12 0m-1.787 8.568a1.2 1.2 0 0 0-1.461 1.88L10.302 12l-1.55 1.552-.1.112a1.2 1.2 0 0 0 1.796 1.584L12 13.698l1.552 1.55.112.1a1.2 1.2 0 0 0 1.584-1.796L13.698 12l1.55-1.552.1-.112a1.2 1.2 0 0 0-1.796-1.584L12 10.302l-1.552-1.55-.112-.1z"
          fill="currentColor"
        />
      </Mask>
      <G mask="url(#a)">
        <Path
          d="M17.55 1.568A11.7 11.7 0 1 1 .006 12.079L0 11.699l.006-.378A11.7 11.7 0 0 1 17.55 1.568"
          fill="currentColor"
        />
      </G>
    </Svg>
  );
};
