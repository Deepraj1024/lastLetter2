import { Text, TouchableOpacity, View } from "react-native";
import Animated2, { FadeInUp } from "react-native-reanimated";
import { Icon } from "@/components/icons";
import { AltArrowRight } from "@/components/icons/alt-arrow-right";
import { AskAi } from "@/components/icons/ask-ai";

interface SuggestionCardProps {
  icon?: React.ReactNode;
  index: number;
  onPress: () => void;
  text: string;
}

export default function SuggestionCard({
  icon,
  index,
  onPress,
  text,
}: SuggestionCardProps) {
  return (
    <Animated2.View
      entering={FadeInUp.delay(index * 60)
        .duration(300)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex-row items-center gap-3.5 rounded-2xl border-border/15 border-y border-r border-l-4 border-l-accent bg-surface-secondary/45 p-4 shadow-sm active:bg-surface-secondary/70"
        onPress={onPress}
      >
        {icon ? (
          <View className="h-9 w-9 items-center justify-center rounded-xl border border-border/15 bg-surface-tertiary">
            {icon}
          </View>
        ) : (
          <View className="h-8.5 w-8.5 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
            <Icon
              className="size-3.5"
              color="accent"
              icon={AskAi}
              withWrapper={false}
            />
          </View>
        )}

        <Text
          className="flex-1 font-bold text-[13.5px] text-foreground leading-5"
          numberOfLines={2}
        >
          {text}
        </Text>

        <View className="h-6.5 w-6.5 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
          <Icon
            className="size-3"
            color="accent"
            icon={AltArrowRight}
            withWrapper={false}
          />
        </View>
      </TouchableOpacity>
    </Animated2.View>
  );
}
