import { router } from "expo-router";
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { useToast } from "heroui-native/toast";
import { useState } from "react";
import { Text, View } from "react-native";

import { Profile } from "@/components/profile";
import {
  useForgetPasswordSendOtp,
  useForgetPasswordVerify,
} from "@/hooks/use-forget-password";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgetEmail() {
  const { toast } = useToast();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { mutate: sendOtp, isPending: isSendingOtp } =
    useForgetPasswordSendOtp();

  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } =
    useForgetPasswordVerify();

  const handleSendOtp = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.show({
        label: "Please enter your email",
        variant: "danger",
      });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast.show({
        label: "Please enter a valid email address",
        variant: "danger",
      });
      return;
    }

    sendOtp(
      { email: trimmedEmail },
      {
        onError: (err) => {
          toast.show({
            label: err?.message || "Failed to send OTP",
            variant: "danger",
          });
        },
        onSuccess: (res) => {
          toast.show({
            label: res?.message || "OTP sent successfully",
            variant: "success",
          });

          setStep("otp");
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) {
      toast.show({
        label: "Please enter OTP",
        variant: "danger",
      });
      return;
    }

    verifyOtp(
      {
        email: email.trim(),
        otp: otp.trim(),
      },
      {
        onError: (err) => {
          toast.show({
            label: err?.message || "Invalid OTP",
            variant: "danger",
          });
        },
        onSuccess: (res) => {
          toast.show({
            label: "OTP verified successfully",
            variant: "success",
          });
          console.log("forget reset Token", res.resetToken);

          router.replace({
            params: {
              email,
              resetToken: res.resetToken,
            },
            pathname: "/(app)/(auth)/forgetPassword",
          });
        },
      }
    );
  };

  return (
    <Profile.Container title="Forgot Password">
      <View className="flex-1 p-5">
        {step === "email" ? (
          <View className="gap-5">
            <Text className="text-base text-foreground/70">
              Enter your registered email to receive an OTP.
            </Text>

            <Input
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Enter email"
              value={email}
            />

            <Button
              isDisabled={isSendingOtp}
              onPress={handleSendOtp}
              size="lg"
              variant="tertiary"
            >
              <Button.Label>
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </Button.Label>
            </Button>
          </View>
        ) : (
          <View className="gap-5">
            <Text className="text-base text-foreground/70">
              Enter the OTP sent to {email}
            </Text>

            <Input
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={setOtp}
              placeholder="Enter OTP"
              value={otp}
            />

            <Button
              isDisabled={isVerifyingOtp}
              onPress={handleVerifyOtp}
              size="md"
              variant="tertiary"
            >
              <Button.Label>
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button.Label>
            </Button>

            <Button
              isDisabled={isSendingOtp}
              onPress={handleSendOtp}
              variant="outline"
            >
              <Button.Label className="text-foreground">
                Resend OTP
              </Button.Label>
            </Button>
          </View>
        )}
      </View>
    </Profile.Container>
  );
}
