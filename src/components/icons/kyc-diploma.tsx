import Svg, { Path, type SvgProps } from "react-native-svg";
import { useResolveClassNames } from "uniwind";
import { cn } from "@/utils/style";

export const KycDiploma = (props: SvgProps) => {
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
        d="M7 17.998c-2.175-.012-3.353-.108-4.121-.877C2 16.243 2 14.828 2 12V8c0-2.828 0-4.243.879-5.121C3.757 2 5.172 2 8 2h8c2.828 0 4.243 0 5.121.879C22 3.757 22 5.172 22 8v4c0 2.828 0 4.243-.879 5.121-.73.73-1.829.854-3.801.875l-.82.002"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <Path
        d="M9 6h6M7 9.5h10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
      />
      <Path
        d="M10.89 13.945a1.71 1.71 0 0 1 2.22 0c.273.234.614.375.972.404a1.71 1.71 0 0 1 1.57 1.568c.028.36.169.7.402.974a1.71 1.71 0 0 1 0 2.218 1.7 1.7 0 0 0-.403.974 1.71 1.71 0 0 1-1.569 1.569 1.7 1.7 0 0 0-.973.403 1.71 1.71 0 0 1-2.219 0 1.7 1.7 0 0 0-.973-.404 1.71 1.71 0 0 1-1.569-1.568 1.7 1.7 0 0 0-.403-.974 1.71 1.71 0 0 1 0-2.218 1.7 1.7 0 0 0 .403-.974 1.71 1.71 0 0 1 1.57-1.568c.358-.029.699-.17.973-.404Z"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <Path
        d="m10.5 18.2.857.8 2.143-2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </Svg>
  );
};
