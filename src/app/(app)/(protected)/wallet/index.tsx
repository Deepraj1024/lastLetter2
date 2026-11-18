import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Card } from 'heroui-native/card';
import { PressableFeedback } from 'heroui-native/pressable-feedback';
import React, { useMemo, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Check } from '@/components/icons/check';
import { Clock } from '@/components/icons/clock';
import { WalletMoney } from '@/components/icons/wallet-money';
import { ImageBackground } from '@/components/images';
import { Profile } from '@/components/profile';
import { useSetting } from '@/hooks/use-setting';
import { useUpisList } from '@/hooks/use-upis';
import { useWithdrawl } from '@/hooks/use-withdrawl';

// oxlint-disable-next-line complexity
export default function Index() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: withdrawl, isLoading } = useWithdrawl();
  const { data: setting } = useSetting();
  console.log('settings', setting?.data);
  const { data: upisData } = useUpisList();

  const settingsMap = useMemo(() => {
    if (!setting?.data) {
      return {};
    }
    return setting.data.reduce<Record<string, string>>((acc, item) => {
      if (item.key) {
        acc[item.key] = item.value;
      }
      return acc;
    }, {});
  }, [setting?.data]);

  // Extract wallet attributes from withdrawal payload
  const walletData = withdrawl?.wallet;
  const currentBalance = Number(walletData?.availableBalance ?? 0);
  const totalCredited = Number(walletData?.totalCredit ?? 0);
  const totalDebited = Number(walletData?.totalDebit ?? 0);

  const minWithdrawalAmount = Number(
    settingsMap.AGENT_MIN_WITHDRAWAL_AMOUNT ?? 0
  );
  const isEligibleForPayout = currentBalance >= minWithdrawalAmount;

  // Memoized payout date calculation
  const nextPayoutDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    // Get dynamic dates from settings, fallback to 5 and 20 if not available
    const date1 = Number(settingsMap.AGENT_PAYOUT_DATE_1 ?? 5);
    const date2 = Number(settingsMap.AGENT_PAYOUT_DATE_2 ?? 20);

    // Ensure dates are ordered correctly (e.g., 4 and 6) just in case
    const firstPayout = Math.min(date1, date2);
    const secondPayout = Math.max(date1, date2);

    // If today is before the first payout date
    if (day < firstPayout) {
      return new Date(year, month, firstPayout);
    }

    // If today is before the second payout date
    if (day < secondPayout) {
      return new Date(year, month, secondPayout);
    }

    // Both payout dates have passed, use first payout date of next month
    return new Date(year, month + 1, firstPayout);
  }, [settingsMap.AGENT_PAYOUT_DATE_1, settingsMap.AGENT_PAYOUT_DATE_2]);

  // Format date helper
  const formattedPayoutDate = useMemo(() => {
    if (!nextPayoutDate) {
      return '--';
    }
    const day = nextPayoutDate.getDate();
    const suffix =
      day > 3 && day < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd'][Math.min(day % 10, 4)] || 'th';

    const monthStr = nextPayoutDate.toLocaleString('en-IN', { month: 'long' });
    return `${day}${suffix} ${monthStr}, ${nextPayoutDate.getFullYear()}`;
  }, [nextPayoutDate]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      queryClient.invalidateQueries({ queryKey: ['withdrawl'] }),
      queryClient.invalidateQueries({ queryKey: ['setting'] }),
      queryClient.invalidateQueries({ queryKey: ['upis-list'] }),
    ]);
    setIsRefreshing(false);
  };

  const primaryUpi = upisData?.data;
  const hasUpi = Boolean(primaryUpi?.upi_id);

  return (
    <Profile.Container
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          tintColor="accent"
        />
      }
      title="Wallet"
    >
      <View className="gap-6 px-4 py-3">
        {/* Balance Card Container */}
        <ImageBackground
          className="h-40 overflow-hidden rounded-3xl"
          contentFit="cover"
          source={require('@/assets/images/wallet-background.png')}
        >
          <View className="flex-1 justify-between bg-black/15 p-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-foreground/80 text-xs font-semibold tracking-wider uppercase">
                  Available Balance
                </Text>
                <Text className="text-foreground mt-1 text-3xl font-extrabold">
                  ₹
                  {currentBalance.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <Icon
                className="bg-foreground/20"
                color="accent"
                icon={WalletMoney}
                size="md"
                variants="soft"
              />
            </View>

            <View className="flex-row items-center gap-6">
              <View>
                <Text className="text-foreground/70 text-[10px] font-bold tracking-wider uppercase">
                  Credited
                </Text>
                <Text className="text-foreground mt-0.5 text-base font-semibold">
                  ₹
                  {totalCredited.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View className="bg-foreground/20 h-6 w-px" />

              <View>
                <Text className="text-foreground/60 text-[10px] font-bold tracking-wider uppercase">
                  Debited
                </Text>
                <Text className="text-foreground mt-0.5 text-base font-semibold">
                  ₹
                  {totalDebited.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Dynamic Payout / Info Card */}
        {isEligibleForPayout ? (
          <Card className="bg-surface border-border/20 rounded-3xl border p-5 shadow-sm">
            <Text className="text-foreground/60 text-xs font-bold tracking-wider uppercase">
              Next Auto-Payout
            </Text>
            <Text className="text-accent mt-1 text-2xl font-black">
              {formattedPayoutDate}
            </Text>

            <View className="mt-3 flex-row items-baseline gap-1.5">
              <Text className="text-foreground/70 text-sm">
                Settlement Value:
              </Text>
              <Text className="text-success text-base font-bold">
                ₹
                {currentBalance.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>

            <View className="bg-border/30 my-4 h-px w-full" />

            <Text className="text-foreground/60 text-xs leading-relaxed">
              Withdrawals are{' '}
              <Text className="text-foreground font-semibold">
                automatically processed
              </Text>{' '}
              each period once threshold limit (₹{minWithdrawalAmount}) is
              reached.
            </Text>
          </Card>
        ) : (
          <Card className="bg-warning/5 border-warning/20 flex-row items-start gap-3 rounded-2xl border p-4">
            <Icon icon={Clock} color="warning" size="sm" variants="soft" />
            <View className="flex-1">
              <Text className="text-warning text-sm font-semibold">
                Payout Threshold Remaining
              </Text>
              <Text className="text-foreground/75 mt-1 text-xs leading-relaxed">
                Your current balance is under the required ₹
                {minWithdrawalAmount} minimum amount to schedule auto payouts.
              </Text>
            </View>
          </Card>
        )}

        {/* Modern UPI Settings Quick access */}
        <Card className="bg-surface border-border/20 rounded-2xl border p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Icon
                icon={WalletMoney}
                color="accent"
                size="sm"
                variants="soft"
              />
              <View>
                <Text className="text-foreground/50 text-[10px] font-bold tracking-wider uppercase">
                  Settlement Method
                </Text>
                <Text className="text-warning text-xsm mt-0.5 font-semibold">
                  {hasUpi ? primaryUpi.name : 'No active UPI ID'}
                </Text>
                <Text className="text-foreground mt-0.5 text-sm font-semibold">
                  {hasUpi ? primaryUpi.upi_id : 'No active UPI ID'}
                </Text>
              </View>
            </View>
            <PressableFeedback
              className={`rounded-full px-4 py-1.5 ${hasUpi ? 'bg-border/30' : 'bg-accent'}`}
              onPress={() => router.push('/(app)/(protected)/upi')}
            >
              <Text
                className={`text-xs font-semibold ${hasUpi ? 'text-foreground/80' : 'text-foreground'}`}
              >
                {hasUpi ? 'Change' : 'Set UPI'}
              </Text>
            </PressableFeedback>
          </View>
        </Card>

        {/* Withdrawal History Section */}
        <View className="gap-4">
          <Text className="text-foreground/70 text-xs font-bold tracking-wider uppercase">
            Withdrawal History
          </Text>

          <View className="gap-3">
            {withdrawl?.data?.map((item) => {
              const isCompleted = item.status?.toLowerCase() === 'completed';

              return (
                <PressableFeedback
                  className="bg-surface border-border/10 flex-row items-center justify-between rounded-2xl border px-4 py-3"
                  key={item.id}
                  onPress={() =>
                    router.push({
                      params: { id: String(item.id) },
                      pathname: '/(app)/(protected)/wallet/[id]',
                    })
                  }
                >
                  <View className="flex-row items-center gap-3.5">
                    <Icon
                      color={isCompleted ? 'success' : 'warning'}
                      icon={isCompleted ? Check : Clock}
                      size="sm"
                      variants="soft"
                    />

                    <View>
                      <Text className="text-foreground text-base font-bold">
                        ₹
                        {Number(item.amount).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <Text className="text-foreground/50 mt-0.5 text-xs">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              'en-IN',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              }
                            )
                          : '-'}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`rounded-full px-3 py-1 ${isCompleted ? 'bg-success/10' : 'bg-warning/10'}`}
                  >
                    <Text
                      className={`text-[10px] font-bold uppercase ${isCompleted ? 'text-success' : 'text-warning'}`}
                    >
                      {item.status ?? 'PENDING'}
                    </Text>
                  </View>
                </PressableFeedback>
              );
            })}

            {!isLoading &&
              (!withdrawl?.data || withdrawl.data.length === 0) && (
                <Card className="bg-surface border-border/50 items-center rounded-2xl border border-dashed p-8">
                  <Text className="text-foreground/50 text-sm font-medium">
                    No payout transactions yet
                  </Text>
                </Card>
              )}
          </View>
        </View>
      </View>
    </Profile.Container>
  );
}
