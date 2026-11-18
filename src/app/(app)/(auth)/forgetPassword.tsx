import { router, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { useToast } from "heroui-native/toast";
import { useState } from "react";
import { Text, View } from "react-native";
import { Icon } from "@/components/icons";
import { Eye } from "@/components/icons/eye";
import { Profile } from "@/components/profile";
import { useResetPassword } from "@/hooks/use-forget-password";

export default function ForgetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { toast } = useToast();

  const { resetToken } = useLocalSearchParams();

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleResetPassword = () => {
    if (!password.trim()) {
      toast.show({
        label: "Please enter a new password",
        variant: "danger",
      });
      return;
    }

    if (password.length < 8) {
      toast.show({
        label: "Password must be at least 8 characters",
        variant: "danger",
      });
      return;
    }

    if (!confirmPassword.trim()) {
      toast.show({
        label: "Please confirm your password",
        variant: "danger",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.show({
        label: "Passwords do not match",
        variant: "danger",
      });
      return;
    }

    resetPassword(
      {
        confirmPassword,
        newPassword: password,
        resetToken: resetToken as string,
      },
      {
        onError: (err) => {
          toast.show({
            label: err?.message || "Failed to reset password",
            variant: "danger",
          });
        },
        onSuccess: (res) => {
          toast.show({
            label: res?.message || "Password reset successfully",
            variant: "success",
          });

          router.replace("/(app)/(auth)/loginScreen");
        },
      }
    );
  };
  return (
    <Profile.Container scrollable={false}>
      <View className="flex-1 justify-between p-4">
        <View className="gap-y-5">
          <View>
            <Text className="font-bold text-3xl text-foreground">
              Reset Password
            </Text>

            <Text className="mt-2 text-foreground/70">
              Create a new password for your account.
            </Text>
          </View>

          <View className="gap-y-2">
            <Text className="font-semibold text-base text-foreground">
              New Password
            </Text>

            <View className="relative">
              <Input
                className="h-16 pr-12"
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
              />

              <PressableFeedback
                className="absolute top-4 right-4"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Icon color="accent" icon={Eye} size="sm" variants="soft" />
              </PressableFeedback>
            </View>
          </View>

          <View className="gap-y-2">
            <Text className="font-semibold text-base text-foreground">
              Confirm Password
            </Text>

            <View className="relative">
              <Input
                className="h-16 pr-12"
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
              />

              <PressableFeedback
                className="absolute top-4 right-4"
                onPress={() => setShowConfirmPassword((prev) => !prev)}
              >
                <Icon color="accent" icon={Eye} size="sm" variants="soft" />
              </PressableFeedback>
            </View>
          </View>
        </View>

        <Button
          className="rounded-xl"
          isDisabled={isPending}
          onPress={handleResetPassword}
          size="lg"
        >
          <Button.Label>
            {isPending ? "Resetting..." : "Reset Password"}
          </Button.Label>
        </Button>
      </View>
    </Profile.Container>
  );
}
