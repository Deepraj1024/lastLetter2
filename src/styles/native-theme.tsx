import type { Theme } from "expo-router/react-navigation";
import { useThemeColor } from "heroui-native/hooks";
import { Platform } from "react-native";

export const useNativeTheme = (isDark = true): Theme => {
  const [
    accentColor,
    borderColor,
    dangerColor,
    surfaceColor,
    backgroundColor,
    foregroundColor,
  ] = useThemeColor([
    "accent",
    "border",
    "danger",
    "surface",
    "background",
    "foreground",
  ]);

  return {
    colors: {
      background: backgroundColor,
      border: borderColor,
      card: surfaceColor,
      notification: accentColor,
      primary: dangerColor,
      text: foregroundColor,
    },
    dark: isDark,
    fonts: Platform.select({
      default: {
        bold: {
          fontFamily: "Inter_700Bold",
          fontWeight: "700",
        },
        heavy: {
          fontFamily: "Inter_900Black",
          fontWeight: "900",
        },
        medium: {
          fontFamily: "Inter_600SemiBold",
          fontWeight: "600",
        },
        regular: {
          fontFamily: "Inter_400Regular",
          fontWeight: "normal",
        },
      },
    }),
  };
};
