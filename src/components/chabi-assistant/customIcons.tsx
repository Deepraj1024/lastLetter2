import { Text, View } from "react-native";

export function WealthIcon() {
  return (
    <View className="h-3.5 w-4 flex-row items-end gap-0.5">
      <View className="h-1.5 w-1 rounded-sm bg-success" />
      <View className="h-2.5 w-1 rounded-sm bg-success" />
      <View className="h-3.5 w-1 rounded-sm bg-success" />
    </View>
  );
}

export function AgentIcon() {
  return (
    <View className="h-3.5 w-4 items-center justify-center">
      <View className="h-1.5 w-1.5 rounded-full bg-accent" />
      <View className="mt-0.5 h-1 w-3 rounded-t bg-accent" />
    </View>
  );
}

export function RewardIcon() {
  return (
    <View className="h-3 w-3 items-center justify-center">
      <View className="h-2 w-2 rotate-45 bg-warning" />
    </View>
  );
}

export function CommissionIcon() {
  return (
    <View className="h-3.5 w-3.5 items-center justify-center rounded-full border border-warning/45 bg-warning/20">
      <Text className="font-bold text-[9px] text-warning leading-none">₹</Text>
    </View>
  );
}

export function ProfileIcon() {
  return (
    <View className="h-3.5 w-4 items-center justify-center">
      <View className="h-1.5 w-1.5 rounded-full bg-foreground/70" />
      <View className="mt-0.5 h-1.5 w-3 rounded-t-full bg-foreground/70" />
    </View>
  );
}

export function SparkIcon() {
  return (
    <View className="h-3 w-3 flex-row items-center justify-center gap-0.5">
      <View className="h-1 w-1 rounded-full bg-accent" />
      <View className="h-1 w-1 rounded-full bg-accent/60" />
    </View>
  );
}

export const renderSuggestionIcon = (type: string) => {
  switch (type) {
    case "wealth":
      return <WealthIcon />;
    case "agent":
      return <AgentIcon />;
    case "reward":
      return <RewardIcon />;
    case "commission":
      return <CommissionIcon />;
    default:
      return <SparkIcon />;
  }
};

export const getCategoryIcon = (category: string) => {
  const lower = category.toLowerCase();
  if (
    lower.includes("sip") ||
    lower.includes("invest") ||
    lower.includes("wealth")
  ) {
    return <WealthIcon />;
  }
  if (
    lower.includes("agent") ||
    lower.includes("partner") ||
    lower.includes("chabi")
  ) {
    return <AgentIcon />;
  }
  if (
    lower.includes("referral") ||
    lower.includes("reward") ||
    lower.includes("invite")
  ) {
    return <RewardIcon />;
  }
  if (
    lower.includes("commission") ||
    lower.includes("payout") ||
    lower.includes("money")
  ) {
    return <CommissionIcon />;
  }
  if (
    lower.includes("account") ||
    lower.includes("profile") ||
    lower.includes("user")
  ) {
    return <ProfileIcon />;
  }
  return <SparkIcon />;
};

// Fancy Base Suggestions mapped to custom vector icons (no emojis)
export const BASE_SUGGESTIONS = [
  {
    color: "success",
    iconType: "wealth",
    tag: "PROFIT",
    text: "Can homemakers invest in FDs?",
  },
  {
    color: "accent",
    iconType: "agent",
    tag: "SYSTEM",
    text: "Can fake accounts generate commission",
  },
  {
    color: "warning",
    iconType: "reward",
    tag: "BONUS",
    text: "Are returns guaranteed?",
  },
  {
    color: "accent",
    iconType: "commission",
    tag: "PAYOUT",
    text: "Can I approach shopkeepers?",
  },
];
