import { Stack } from "expo-router";
import { View } from "react-native";

export default function ProtectedLayout() {
  return (
    <View className="flex flex-1 bg-background">
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}
