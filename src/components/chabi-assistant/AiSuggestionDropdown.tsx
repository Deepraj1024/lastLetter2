import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import Animated2, {
  FadeIn,
  FadeInDown,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { Icon } from "@/components/icons";
import { AltArrowRight } from "@/components/icons/alt-arrow-right";
import { AskAi } from "@/components/icons/ask-ai";

interface AiSuggestionDropdownProps {
  isFetching: boolean;
  onSuggestionPress: (text: string) => void;
  suggestions: string[];
}

const MAX_SUGGESTIONS = 6;

export default function AiSuggestionDropdown({
  isFetching,
  onSuggestionPress,
  suggestions,
}: AiSuggestionDropdownProps) {
  if (suggestions.length === 0 && !isFetching) {
    return null;
  }

  const displaySuggestions = suggestions.slice(0, MAX_SUGGESTIONS);

  return (
    <Animated2.View
      className="bg-background px-4 pb-1"
      entering={SlideInDown.duration(250).springify()}
      exiting={FadeOut.duration(150)}
    >
      <View className="overflow-hidden rounded-2xl border border-border/30 bg-surface/95 shadow-2xl shadow-accent/5">
        {/* Header */}
        <View className="flex-row items-center gap-2.5 border-border/15 border-b bg-surface-secondary/80 px-4 py-3">
          <Icon
            color="warning"
            icon={AskAi}
            variants="soft"
            withWrapper={false}
          />
          <Text className="font-bold text-[11px] text-foreground/75 uppercase tracking-wider">
            AI Suggestions
          </Text>
          <Text className="ml-auto font-semibold text-[11px] text-foreground/40">
            {displaySuggestions.length}/{MAX_SUGGESTIONS}
          </Text>
          {isFetching && (
            <Animated2.View className="ml-1" entering={FadeIn.duration(200)}>
              <PulsingDot />
            </Animated2.View>
          )}
        </View>

        {/* Loading skeleton */}
        {isFetching && displaySuggestions.length === 0 && (
          <Animated2.View
            className="flex-row items-center gap-3 px-4 py-5"
            entering={FadeIn.duration(200)}
          >
            <View className="flex-row gap-1.5">
              <ShimmerDot delay={0} />
              <ShimmerDot delay={100} />
              <ShimmerDot delay={200} />
            </View>
            <Text className="font-medium text-foreground/50 text-sm italic">
              Finding suggestions...
            </Text>
          </Animated2.View>
        )}

        {/* Suggestion rows */}
        <View className="divide-y divide-border/10">
          {displaySuggestions.map((sug, index) => (
            <Animated2.View
              entering={FadeInDown.delay(index * 50)
                .duration(200)
                .springify()}
              key={sug}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                className="flex-row items-center gap-3.5 px-4 py-4 active:bg-surface-secondary/50"
                onPress={() => onSuggestionPress(sug)}
              >
                <View className="h-6 w-6 items-center justify-center rounded-lg border border-accent/25 bg-accent/15">
                  <Text className="font-extrabold text-[10px] text-accent">
                    {index + 1}
                  </Text>
                </View>
                <Text
                  className="flex-1 font-semibold text-[13.5px] text-foreground leading-5"
                  numberOfLines={2}
                >
                  {sug}
                </Text>

                {/* Sleek rounded container for arrow key */}
                <View className="h-5.5 w-5.5 items-center justify-center rounded-md border border-white/10 bg-white/5">
                  <Icon
                    className="size-2.5"
                    color="default"
                    icon={AltArrowRight}
                    withWrapper={false}
                  />
                </View>
              </TouchableOpacity>
            </Animated2.View>
          ))}
        </View>
      </View>
    </Animated2.View>
  );
}

// ─── Pulsing Status Dot ───────────────────────────────────────────────────────

function PulsingDot() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          duration: 600,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 600,
          toValue: 0.3,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      className="rounded-full bg-accent"
      style={{ height: 6, opacity, width: 6 }}
    />
  );
}

// ─── Shimmer Dots ─────────────────────────────────────────────────────────────

function ShimmerDot({ delay = 0 }: { delay?: number }) {
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          duration: 400,
          toValue: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: 400,
          toValue: 0.2,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [delay, opacity]);

  return (
    <Animated.View
      className="rounded-full bg-accent"
      style={{ height: 5, opacity, width: 5 }}
    />
  );
}
