import { useEffect, useRef } from "react";
import { Animated, Image, View } from "react-native";

export default function GlowingLogo() {
  const scale = useRef(new Animated.Value(0.95)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            duration: 1500,
            toValue: 1.05,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            duration: 1500,
            toValue: 0.95,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glow, {
            duration: 1500,
            toValue: 0.8,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            duration: 1500,
            toValue: 0.4,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [scale, glow]);

  return (
    <View className="mb-6 items-center justify-center">
      {/* Outer pulsing neon glow ring */}
      <Animated.View
        className="absolute h-24 w-24 rounded-full border border-accent/25 bg-accent/5"
        style={{
          opacity: glow,
          transform: [{ scale }],
        }}
      />
      {/* Inner super-ellipse structured squircle container with official brand icon */}
      <View className="h-18 w-18 items-center justify-center rounded-2xl border border-border/40 border-continuous bg-surface-secondary shadow-accent/10 shadow-xl">
        <Image
          className="h-20 w-20"
          resizeMode="contain"
          source={require("@/assets/images/agent.png")}
        />
        {/* Glowing floating status indicator dot */}
        <View className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-accent shadow shadow-accent/50" />
      </View>
    </View>
  );
}
