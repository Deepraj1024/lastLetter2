import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="registration" />
      <Stack.Screen name="verification" />
      <Stack.Screen name="panVerification" />
      <Stack.Screen name="aadharVerification" />
      <Stack.Screen name="onBoarding" />
      <Stack.Screen name="loginScreen" />
      <Stack.Screen name="forgetEmail" />
      <Stack.Screen name="forgetPassword" />
    </Stack>
  );
}
