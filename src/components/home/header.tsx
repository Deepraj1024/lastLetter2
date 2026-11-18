import { Link, router } from "expo-router";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { View } from "react-native";
import type { ClassNameValue } from "tailwind-merge";
import { Menu } from "@/components/icons/menu";
import { cn } from "@/utils/style";
import { Image } from "../images";

interface HeaderProps {
  className?: ClassNameValue;
}

export default function Header({ className }: HeaderProps) {
  return (
    <View
      className={cn(
        "flex flex-row items-center justify-between bg-background px-safe-or-4 pt-safe",
        className
      )}
    >
      <PressableFeedback
        className="p-2"
        onPress={() => router.push("/(app)/(protected)/profile")}
      >
        <Menu className="size-8 text-foreground" />
      </PressableFeedback>

      <View className="flex-row items-center gap-3">
        <Link href="/(app)/(protected)/support">
          <Image
            className="h-10 w-10"
            contentFit="cover"
            source={require("@/assets/images/support-icon.png")}
          />
        </Link>
      </View>
    </View>
  );
}
