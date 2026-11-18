import type {
  ImageContentFit,
  ImageContentPosition,
  ImageSource,
} from "expo-image";
import { ImageBackground as ImgBgComp, Image as ImgComp } from "expo-image";
import type { ClassNameValue } from "tailwind-merge";
import { withUniwind } from "uniwind";
import { cn } from "@/utils/style";

interface ImgProps {
  className?: ClassNameValue;
  contentFit?: ImageContentFit;
  contentPosition?: ImageContentPosition;
  placeholder?: string;
  source: ImageSource;
}

const Img = withUniwind(ImgComp);
const ImgBg = withUniwind(ImgBgComp);

export const Image = (props: ImgProps) => (
  <Img
    className={cn("", props.className)}
    contentFit={props.contentFit}
    contentPosition={props.contentPosition}
    placeholder={{ blurhash: props.placeholder }}
    source={props.source}
  />
);

export const ImageBackground = ImgBg;
