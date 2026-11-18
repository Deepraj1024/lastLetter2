import { useLocalSearchParams } from 'expo-router';
import { BottomSheet } from 'heroui-native/bottom-sheet';
import { Skeleton } from 'heroui-native/skeleton';
import { useCallback, useMemo, useState } from 'react';
import { Image, RefreshControl, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Icon } from '@/components/icons';
import { Coins } from '@/components/icons/coins';
import { Profile } from '@/components/profile';
import { useReferralDetails } from '@/hooks/use-referrals-details';

const MetalType = {
  GOLD: 'gold',
  SILVER: 'silver',
} as const;

type MetalTypeValue = (typeof MetalType)[keyof typeof MetalType];

const TransactionType = {
  DAILY_SAVING: 'daily_saving',
  INSTANT_SAVING: 'instant_saving',
  MONTHLY_SAVING: 'monthly_saving',
  OTHER: 'other',
  REFUND: 'refund',
  SELL_METAL: 'sell_metal',
  TRANSFER: 'transfer',
  WEEKLY_SAVING: 'weekly_saving',
} as const;

type TransactionTypeValue =
  (typeof TransactionType)[keyof typeof TransactionType];

const metalConfig: Record<
  MetalTypeValue,
  { bgColor: string; color: 'warning' | 'default' }
> = {
  [MetalType.GOLD]: { bgColor: 'bg-warning/10', color: 'warning' },
  [MetalType.SILVER]: { bgColor: 'bg-foreground/10', color: 'default' },
};

const transactionLabels: Record<TransactionTypeValue, string> = {
  [TransactionType.DAILY_SAVING]: 'Daily Saving',
  [TransactionType.INSTANT_SAVING]: 'Instant Saving',
  [TransactionType.MONTHLY_SAVING]: 'Monthly Saving',
  [TransactionType.OTHER]: 'Other',
  [TransactionType.REFUND]: 'Refund',
  [TransactionType.SELL_METAL]: 'Sell Metal',
  [TransactionType.TRANSFER]: 'Transfer',
  [TransactionType.WEEKLY_SAVING]: 'Weekly Saving',
};

const commissionData = [
  {
    color: 'bg-success',
    text: 'You earn 1% upfront on every new investors you bring in.',
    title: 'Year 1',
  },
  {
    color: 'bg-success',
    text: "You earn 1% on new investors plus 0.75% on last year's investors who keep investing.",
    title: 'Year 2',
  },
  {
    color: 'bg-success',
    text: 'All three years of investors are paying you — 1% on new, 0.75% on Year 2 investors, and 0.5% on your oldest Year 1 investors.',
    title: 'Year 3',
  },
  {
    color: 'bg-success',
    text: 'You continue to earn a 0.5% trail every year on the total assets of all investors who stay with you.',
    title: 'After Year 3',
  },
];

type ListItem =
  | { id: string; type: 'profile_header' }
  | { id: string; type: 'summary_cards' }
  | { id: string; type: 'sticky_title' }
  | { id: string; type: 'empty_state' }
  | { id: string; type: 'loading_footer' }
  | ((typeof transactions)[number] & { type: 'transaction' });

export default function UserCard() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const offsetY = useSharedValue(0);
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
    data: referralDetails,
    isLoading: isLoadingReferralDetails,
    refetch,
  } = useReferralDetails(userId);

  const profile = referralDetails?.data?.profile;
  const totalData = referralDetails?.data?.totalData;
  const currentMonthData = referralDetails?.data?.currentMonthData;
  const transactions = referralDetails?.data?.investmentList ?? [];

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  }, [refetch]);

  // Added subLabel to clearly distinguish pre-tax cards
  const summaryCards = [
    {
      label: 'THIS MONTH',
      subLabel: 'Excl. Tax',
      value: currentMonthData?.currentMonthPreTax,
    },
    {
      label: 'TOTAL INVESTED',
      subLabel: 'Excl. Tax',
      value: totalData?.totalPreTax,
    },
    {
      label: 'EARN THIS MONTH',
      subLabel: null,
      value: currentMonthData?.monthCommissionEarned,
    },
    {
      label: 'TOTAL EARNING',
      subLabel: null,
      value: totalData?.totalCommissionEarned,
    },
  ];

  const listData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [
      { id: 'profile', type: 'profile_header' },
      { id: 'summary', type: 'summary_cards' },
      { id: 'title', type: 'sticky_title' },
    ];

    if (transactions.length === 0 && !isLoadingReferralDetails) {
      items.push({ id: 'empty', type: 'empty_state' });
    } else if (transactions.length === 0 && isLoadingReferralDetails) {
      items.push({ id: 'initial-loading', type: 'loading_footer' });
    } else {
      items.push(
        ...transactions.map((t) => ({ ...t, type: 'transaction' as const }))
      );
      if (isLoadingReferralDetails) {
        items.push({ id: 'footer-loading', type: 'loading_footer' });
      }
    }

    return items;
  }, [transactions, isLoadingReferralDetails]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      switch (item.type) {
        case 'profile_header': {
          return (
            <View className="px-4 pt-4">
              <Animated.View style={headerAnimatedStyle}>
                <View className="border-border bg-surface rounded-[28px] border p-5">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      {isLoadingReferralDetails ? (
                        <Skeleton className="h-8 w-40 rounded-lg" />
                      ) : (
                        <Text
                          className="text-foreground text-xl font-extrabold"
                          numberOfLines={1}
                        >
                          {profile?.name?.toUpperCase()}
                        </Text>
                      )}
                      {isLoadingReferralDetails ? (
                        <Skeleton className="mt-1 h-5 w-32 rounded-lg" />
                      ) : (
                        <Text className="text-foreground/70 mt-1 text-base">
                          Joined{' '}
                          {profile?.joiningDate
                            ? new Date(profile.joiningDate).toLocaleDateString(
                                'en-IN',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                }
                              )
                            : '-'}
                        </Text>
                      )}
                    </View>

                    <View className="border-success bg-success/20 rounded-2xl border px-4 py-2">
                      <Text className="text-success text-xs font-bold">
                        ACTIVE
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>
          );
        }

        case 'summary_cards': {
          const rows = [
            [summaryCards[0], summaryCards[1]],
            [summaryCards[2], summaryCards[3]],
          ];

          return (
            <View className="mt-6 px-4">
              <Text className="text-accent mb-3 text-base font-bold">
                INVESTMENT SUMMARY
              </Text>

              <View className="gap-3">
                {rows.map((row, rowIndex) => (
                  <View className="flex-row gap-3" key={rowIndex}>
                    {row.map((card) => (
                      <View
                        className="border-border bg-surface flex-1 rounded-3xl border p-4"
                        key={card.label}
                      >
                        {/* Label */}
                        <Text
                          className="text-foreground/70 text-10px font-semibold"
                          numberOfLines={1}
                        >
                          {card.label}
                        </Text>

                        {/* Badge — stacked below label, no horizontal collision */}
                        {card.subLabel && (
                          <View className="mt-1 self-start">
                            <Text className="text-accent bg-accent/10 text-10px rounded-md px-1.5 py-0.5 font-bold">
                              {card.subLabel}
                            </Text>
                          </View>
                        )}

                        {/* Value */}
                        {isLoadingReferralDetails ? (
                          <Skeleton className="mt-3 h-8 w-20 rounded-lg" />
                        ) : (
                          <Text
                            className="text-foreground mt-3 text-2xl font-bold"
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            ₹{card.value ?? 0}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          );
        }
        case 'sticky_title': {
          return (
            <View className="bg-background px-4 pt-2 pb-4">
              <Text className="text-accent text-base font-bold">
                RECENT TRANSACTIONS
              </Text>
            </View>
          );
        }

        case 'empty_state': {
          return (
            <View className="px-4 py-8">
              <Text className="text-foreground/60 text-center">
                No transactions found
              </Text>
            </View>
          );
        }

        case 'loading_footer': {
          return (
            <View className="px-4 py-4">
              <Skeleton className="mb-4 h-16 w-full rounded-lg" />
              <Skeleton className="mb-4 h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </View>
          );
        }

        case 'transaction': {
          const metal =
            metalConfig[item.metalType as MetalTypeValue] ??
            metalConfig[MetalType.GOLD];

          const typeLabel =
            transactionLabels[item.investmentType as TransactionTypeValue] ??
            item.investmentType;

          return (
            <View className="border-border border-b px-4 py-4">
              <View className="flex-row items-center gap-x-3">
                <Icon
                  color={metal.color}
                  icon={Coins}
                  size="sm"
                  variants="soft"
                />

                <View className="min-w-0 flex-1">
                  <Text className="text-foreground text-base font-bold">
                    {typeLabel}
                  </Text>

                  <Text className="text-foreground/50 mt-0.5 text-xs">
                    {new Date(item.date).toLocaleString('en-IN', {
                      day: '2-digit',
                      hour: '2-digit',
                      hour12: true,
                      minute: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>

                <View className="shrink-0 items-end">
                  {/* Commission Earned */}
                  <Text className="text-success text-base font-bold">
                    +₹{item.commissionAmount}
                  </Text>

                  {/* Percentage of Pre-tax Amount */}
                  <View className="mt-1 flex-row items-center gap-x-1.5">
                    <Text className="bg-surface text-foreground/80 text-10px rounded-md px-1.5 py-0.5 font-bold">
                      {item.commissionPercent}%
                    </Text>
                    <Text className="text-foreground/70 text-11px">
                      of ₹{item.preTaxAmount}{' '}
                      <Text className="text-foreground/40 text-10px">
                        (Excl. Tax)
                      </Text>
                    </Text>
                  </View>

                  {/* Total Invested Amount */}
                  <Text className="text-foreground/90 mt-1.5 text-sm font-semibold">
                    ₹{item.investmentAmount}{' '}
                    <Text className="text-foreground/70 text-xs font-normal">
                      invested
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          );
        }

        default: {
          return null;
        }
      }
    },
    [
      profile,
      isLoadingReferralDetails,
      currentMonthData,
      totalData,
      headerAnimatedStyle,
      summaryCards,
    ]
  );

  const keyExtractor = useCallback((item: ListItem) => item.id, []);

  return (
    <Profile.Container
      onRightActionPress={() => setOpen(true)}
      rightAction
      scrollable={false}
      title="Investor Profile"
    >
      <Animated.FlatList
        className="bg-background flex-1"
        data={listData}
        keyExtractor={keyExtractor}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={isRefreshing} />
        }
        renderItem={renderItem}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      />

      {/* Bottom Sheet */}
      <BottomSheet isOpen={open} onOpenChange={setOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay className="bg-black/70" />

          <BottomSheet.Content
            backgroundClassName="bg-background/70 rounded-t-3xl"
            className="bg-background rounded-t-3xl px-0 pt-6"
            enableOverDrag={false}
            snapPoints={['50%', '90%']}
          >
            <View className="mb-4 w-full overflow-hidden rounded-2xl">
              <Image
                className="h-44 w-full"
                resizeMode="cover"
                source={require('@/assets/images/commission-source.png')}
              />
            </View>

            <View className="px-6">
              <BottomSheet.Title className="text-foreground text-base font-bold">
                Earning Structure
              </BottomSheet.Title>

              <BottomSheet.Description className="text-foreground/70 mt-2 text-sm">
                The more investors you onboard each year, the more your Earning
                layers and grows over time:
              </BottomSheet.Description>

              <View className="mt-4 gap-6">
                {commissionData.map((item) => (
                  <View className="flex-row items-start" key={item.title}>
                    <View
                      className={`mt-2 mr-4 h-2.5 w-2.5 rounded-full ${item.color}`}
                    />
                    <Text className="text-foreground/90 flex-1 text-sm">
                      <Text className="text-foreground font-bold">
                        {item.title}:{' '}
                      </Text>
                      {item.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </Profile.Container>
  );
}
