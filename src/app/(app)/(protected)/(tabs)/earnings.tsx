import { useRouter } from 'expo-router';
import { Card } from 'heroui-native/card';
import { PressableFeedback } from 'heroui-native/pressable-feedback';
import { Skeleton } from 'heroui-native/skeleton';
import { useCallback, useMemo, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Container } from '@/components/container';
import { Icon } from '@/components/icons';
import { Coins } from '@/components/icons/coins';
import { Rewards } from '@/components/icons/rewards';
import { WalletMoney } from '@/components/icons/wallet-money';
import { useRecentTransaction } from '@/hooks/use-recent-transaction';
import { useReferral } from '@/hooks/use-referral';

// Constants & configurations shared with Sub-components
const MetalType = { GOLD: 'gold', SILVER: 'silver' } as const;
type MetalTypeValue = (typeof MetalType)[keyof typeof MetalType];

const metalConfig: Record<
  MetalTypeValue,
  { bgColor: string; color: 'warning' | 'default' }
> = {
  [MetalType.GOLD]: { bgColor: 'bg-warning/10', color: 'warning' },
  [MetalType.SILVER]: { bgColor: 'bg-foreground/10', color: 'default' },
};

interface TransactionItem {
  id: string | number;
  userName: string;
  createdAt: string;
  investmentType: string;
  metalType: string;
  commissionAmount: string | number;
  commissionPercent: string | number;
  preTaxAmount: string | number;
}

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const getInvestmentLabel = (type: string): string =>
  type === 'daily_saving'
    ? 'Daily'
    : type === 'instant_saving'
      ? 'Instant'
      : type;

// Reusable Components
const TransactionRow = ({ item }: { item: TransactionItem }) => {
  const metal =
    metalConfig[item.metalType as MetalTypeValue] ??
    metalConfig[MetalType.GOLD];
  return (
    <View className="border-border border-b py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View
            className={`mr-2 h-10 w-10 items-center justify-center rounded-full ${metal.bgColor}`}
          >
            <Icon color={metal.color} icon={Coins} size="sm" variants="soft" />
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-sm font-bold uppercase">
              {item.userName}
            </Text>
            <View className="mt-0.5 flex-row items-center gap-2">
              <Text className="text-foreground/70 text-xs">
                {formatDate(item.createdAt)}
              </Text>
              <View className="bg-accent/10 rounded-full px-2 py-0.5">
                <Text className="text-accent text-10px font-medium">
                  {getInvestmentLabel(item.investmentType).split('_')[0]}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="items-end">
          <View className="flex-row items-center">
            <Text className="text-success text-10px font-bold">
              +₹{Number(item.commissionAmount).toLocaleString('en-IN')}
            </Text>
            <View className="bg-surface ml-2 rounded-2xl px-2 py-0.5">
              <Text className="text-foreground text-10px font-extrabold">
                {item.commissionPercent}%
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Text className="text-foreground text-sm font-semibold">
              ₹{Number(item.preTaxAmount).toLocaleString('en-IN')}
            </Text>
            <Text className="text-foreground/70 mt-0.5 text-xs">Invest</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const EarningsCard = ({
  isLoading,
  totalEarnings,
  thisMonth,
  transactionCount,
}: {
  isLoading: boolean;
  totalEarnings: number;
  thisMonth: number;
  transactionCount: number;
}) => (
  <Card className="overflow-hidden">
    <Text className="text-accent text-lg font-bold">TOTAL EARNINGS</Text>
    <Skeleton className="mt-1 h-5 w-20 rounded-md" isLoading={isLoading}>
      <Text className="text-foreground mt-1 ml-2 text-xl font-bold">
        ₹ {totalEarnings}
      </Text>
    </Skeleton>
    <View className="mt-3 flex-row items-center justify-between">
      <View>
        <Text className="text-accent text-base">CURRENT MONTH</Text>
        <Skeleton className="mt-1 h-4 w-16 rounded-md" isLoading={isLoading}>
          <Text className="text-foreground mt-1 ml-2 text-base font-semibold">
            ₹ {thisMonth}
          </Text>
        </Skeleton>
      </View>
    </View>
    <View className="bg-foreground/20 my-2 h-px w-full" />
    <View className="flex-row items-center justify-between">
      <View>
        <Text className="text-foreground/60 text-xs">Activity</Text>
        <Text className="text-foreground text-sm font-semibold">
          {transactionCount > 0 ? `${transactionCount}+ Earnings` : '0 Earning'}
        </Text>
      </View>
    </View>
  </Card>
);

const ActionButtons = ({
  onWallet,
  onRewards,
}: {
  onWallet: () => void;
  onRewards: () => void;
}) => (
  <View className="mt-5 flex-row gap-2 px-4">
    <PressableFeedback
      className="bg-surface flex-1 rounded-2xl p-3"
      onPress={onWallet}
    >
      <View className="h-8 w-8 items-center justify-center rounded-full">
        <Icon color="accent" icon={WalletMoney} size="sm" variants="soft" />
      </View>
      <Text className="text-foreground mt-2 text-sm font-bold">
        Go To Wallet
      </Text>
      <Text className="text-foreground/60 mt-0.5 text-xs">
        Manage funds & withdraw
      </Text>
    </PressableFeedback>
    <PressableFeedback
      className="bg-surface flex-1 rounded-2xl p-3"
      onPress={onRewards}
    >
      <View className="h-8 w-8 items-center justify-center rounded-full">
        <Icon color="warning" icon={Rewards} size="sm" variants="soft" />
      </View>
      <Text className="text-foreground mt-2 text-sm font-bold">Rewards</Text>
      <Text className="text-foreground/60 text-10px mt-0.5">
        Win trips on target achievement
      </Text>
    </PressableFeedback>
  </View>
);

export default function Earnings() {
  const router = useRouter();
  const offsetY = useSharedValue(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      offsetY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offsetY.value, [0, 100], [1, 0.8], 'clamp'),
    transform: [
      { scale: interpolate(offsetY.value, [0, 150], [1, 0.95], 'clamp') },
    ],
  }));

  const {
    data: referralData,
    isLoading: isReferralLoading,
    refetch: refetchReferral,
  } = useReferral();

  const currentYear = new Date().getFullYear();

  // Fetch standard data (all for current year, client cuts to first 5)
  const {
    data: transactionData,
    isLoading: isTransactionLoading,
    refetch: refetchTransaction,
  } = useRecentTransaction({ year: currentYear });

  const totalEarnings =
    referralData?.data?.totalData?.totalComissionEarned ?? 0;
  const thisMonth =
    referralData?.data?.currentMonthData?.totalComissionEarned ?? 0;
  const allTransactions = (transactionData?.data as TransactionItem[]) ?? [];

  // Show only top 5 recent transactions
  const topFiveTransactions = useMemo(
    () => allTransactions.slice(0, 5),
    [allTransactions]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchReferral(), refetchTransaction()]);
    } catch (error) {
      console.log('Refresh error:', error);
    }
    setIsRefreshing(false);
  }, [refetchReferral, refetchTransaction]);

  return (
    <Container scrollable={false}>
      <View className="flex-1">
        <Animated.ScrollView
          onScroll={scrollHandler}
          refreshControl={
            <RefreshControl
              colors={['#0066FF']}
              onRefresh={handleRefresh}
              refreshing={isRefreshing}
            />
          }
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {/* Earnings card */}
          <View className="px-4 pt-4">
            <Animated.View style={headerAnimatedStyle}>
              <EarningsCard
                isLoading={isReferralLoading}
                thisMonth={thisMonth}
                totalEarnings={totalEarnings}
                transactionCount={allTransactions.length}
              />
            </Animated.View>
          </View>

          {/* Wallet and Rewards Shortcuts */}
          <ActionButtons
            onRewards={() => router.push('/(app)/(protected)/rewards')}
            onWallet={() => router.push('/(app)/(protected)/wallet')}
          />

          {/* Simple Recent List Preview */}
          <View className="px-4 pt-6 pb-20">
            <View className="flex-row items-center justify-between pb-3">
              <Text className="text-accent text-base font-bold">
                Recent Transaction
              </Text>
            </View>

            {isTransactionLoading && (
              <View className="gap-2">
                {[1, 2, 3].map((i) => (
                  <View
                    className="bg-surface h-16 w-full animate-pulse rounded-xl"
                    key={i}
                  />
                ))}
              </View>
            )}

            {!isTransactionLoading && topFiveTransactions.length === 0 && (
              <View className="p-8">
                <Text className="text-foreground/70 text-center text-sm">
                  No recent transactions.
                </Text>
              </View>
            )}

            {topFiveTransactions.map((item) => (
              <TransactionRow item={item} key={item.id.toString()} />
            ))}

            {allTransactions.length > 5 && (
              <PressableFeedback
                className="bg-surface mt-4 items-center rounded-xl py-3"
                onPress={() =>
                  router.push('/(app)/(protected)/all-transaction')
                }
              >
                <Text className="text-accent text-sm font-bold">
                  View All Transaction
                </Text>
              </PressableFeedback>
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </Container>
  );
}
