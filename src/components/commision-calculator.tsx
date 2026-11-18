/** biome-ignore-all lint/suspicious/noExplicitAny: <do it later> */
import { Text, View } from 'react-native';

import { Icon } from '@/components/icons';

export const CommissionCard = ({
  year,
  tag,
  amount,
  subtitle,
  icon,
  highlight,
}: {
  year: string;
  tag: string;
  amount: string;
  subtitle: string;
  icon: React.ComponentType;
  highlight?: boolean;
}) => (
  <View
    className={`mb-4 rounded-3xl px-5 py-5 ${
      highlight ? 'bg-linear-to-r from-[#4FA3FF] to-[#1E5BFF]' : 'bg-surface'
    }`}
    style={{
      elevation: 5,
      shadowColor: highlight ? '#3B82F6' : '#000',
      shadowOpacity: 0.3,
      shadowRadius: 20,
    }}
  >
    <View className="flex-row items-start justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-foreground text-sm font-bold">{year}</Text>

          <View
            className={`rounded-full px-3 py-1 ${
              highlight ? 'bg-warning' : 'bg-foreground/10'
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                highlight ? 'text-text' : 'text-foreground'
              }`}
            >
              {tag}
            </Text>
          </View>
        </View>

        <Text className="text-foreground/80 mt-2 text-sm">Est. Earning</Text>

        <Text className="text-foreground mt-1 text-3xl font-bold">
          {amount}
        </Text>

        <Text
          className={`mt-2 text-sm ${
            highlight ? 'text-foreground' : 'text-success'
          }`}
        >
          {subtitle}
        </Text>
      </View>

      <View
        className={`h-14 w-14 items-center justify-center rounded-2xl ${
          highlight ? 'bg-warning/40' : 'bg-foreground/10'
        }`}
      >
        <Icon color="accent" icon={icon as any} size="lg" withWrapper={false} />
      </View>
    </View>
  </View>
);
