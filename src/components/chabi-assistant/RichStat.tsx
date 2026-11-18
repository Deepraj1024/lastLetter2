import { Text, View } from "react-native";
import { AgentIcon, CommissionIcon, WealthIcon } from "./customIcons";

interface RichStatProps {
  highlight?: boolean;
  label: string;
  type?: "projected" | "invested" | "returns";
  value: string;
}

export default function RichStat({
  label,
  value,
  highlight,
  type,
}: RichStatProps) {
  return (
    <View
      className={`flex-1 rounded-xl border border-continuous p-3 ${
        highlight
          ? "border-success/35 bg-success/15 shadow-sm shadow-success/5"
          : "border-border/20 bg-surface-secondary/60 shadow-sm"
      }`}
    >
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="font-extrabold text-[9px] text-foreground/50 uppercase tracking-widest">
          {label}
        </Text>
        {/* Customized visual micro-badges (No emojis) */}
        {type === "projected" && <WealthIcon />}
        {type === "invested" && <AgentIcon />}
        {type === "returns" && <CommissionIcon />}
      </View>
      <Text
        className={`font-extrabold text-[15px] ${
          highlight ? "text-success" : "text-foreground"
        }`}
      >
        {value}
      </Text>

      {/* Interactive visual progress guides to simulate dynamic dashboards */}
      {type === "projected" && (
        <View className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <View className="h-full w-[75%] rounded-full bg-accent" />
        </View>
      )}
      {type === "invested" && (
        <View className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <View className="h-full w-full rounded-full bg-slate-400" />
        </View>
      )}
      {type === "returns" && (
        <View className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-success/20">
          <View className="h-full w-[65%] rounded-full bg-success" />
        </View>
      )}
    </View>
  );
}
