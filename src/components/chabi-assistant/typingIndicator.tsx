import { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";
import Animated2, { FadeInDown } from "react-native-reanimated";

export default function TypingIndicator() {
  return (
    <Animated2.View
      className="mb-5 flex-row items-start gap-3"
      entering={FadeInDown.duration(200)}
    >
      <View className="h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/30 bg-surface shadow-sm">
        <Image
          className="h-6.5 w-6.5"
          resizeMode="contain"
          source={require("@/assets/images/chabi-ai.png")}
        />
      </View>

      <View>
        <View className="mb-1.5 flex-row items-center gap-1.5">
          <Text className="font-extrabold text-[11px] text-foreground/45 uppercase tracking-wider">
            Chabi AI
          </Text>
          <View className="animate-pulse rounded border border-accent/20 bg-accent/15 px-1.5 py-0.5">
            <Text className="font-bold text-[8px] text-accent uppercase">
              thinking
            </Text>
          </View>
        </View>
        {/* Typing Dot bubble styled with matching left accent border */}
        <View className="flex-row gap-1.5 rounded-2xl rounded-tl-sm border-border/20 border-y border-r border-l-4 border-l-accent bg-surface-secondary/35 px-5 py-4 shadow-sm">
          <TypingDot delay={0} />
          <TypingDot delay={150} />
          <TypingDot delay={300} />
        </View>
      </View>
    </Animated2.View>
  );
}

// ─── Typing Dot Animation ───────────────────────────────────────────────────

function TypingDot({ delay = 0 }: { delay?: number }) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {
            duration: 400,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            duration: 400,
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            duration: 400,
            toValue: 0.4,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            duration: 400,
            toValue: 0.3,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [delay, opacity, scale]);

  return (
    <Animated.View
      className="bg-accent"
      style={{
        borderRadius: 4,
        height: 8,
        opacity,
        transform: [{ scale }],
        width: 8,
      }}
    />
  );
}
