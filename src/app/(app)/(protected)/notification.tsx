import { Text, View } from "react-native";
import { Profile } from "@/components/profile";

export default function Notification() {
  return (
    <Profile.Container>
      <View className="flex-1 items-center justify-center">
        <Text className="text-foreground text-lg">
          You have no notifications
        </Text>
      </View>
    </Profile.Container>
  );
}
