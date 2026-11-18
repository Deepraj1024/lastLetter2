import { Card } from "heroui-native/card";
import { PressableFeedback } from "heroui-native/pressable-feedback";
import { Text, View } from "react-native";

interface VerificationCardProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
  title: string;
  verified?: boolean;
}

export function VerificationCard({
  title,
  verified,
  onPress,
  isDisabled,
  isLoading,
}: VerificationCardProps) {
  return (
    <PressableFeedback isDisabled={isDisabled || verified} onPress={onPress}>
      <Card className="flex-row items-center justify-between rounded-2xl border border-border px-4 py-4">
        <Text className="font-medium text-base text-foreground">{title}</Text>

        <View
          className={`rounded-full px-4 py-1 ${
            verified
              ? "border border-success bg-success/10"
              : "border border-accent bg-accent/10"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              verified ? "text-success" : "text-accent"
            }`}
          >
            {/** biome-ignore lint/style/noNestedTernary: will do */}
            {verified ? "Verified" : isLoading ? "Loading..." : "Verify Now"}
          </Text>
        </View>
      </Card>
    </PressableFeedback>
  );
}
