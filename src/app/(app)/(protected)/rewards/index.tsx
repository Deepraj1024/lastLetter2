import { BottomSheet } from 'heroui-native/bottom-sheet';
import { Card } from 'heroui-native/card';
import { Skeleton } from 'heroui-native/skeleton';
import { useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Check } from '@/components/icons/check';
import { Profile } from '@/components/profile';
import RewardBanner from '@/components/reward-banner';
import { useReferral } from '@/hooks/use-referral';
import { useRewards } from '@/hooks/use-rewards';
import { queryClient } from '@/utils/query';

const rewardAssets = {
  gold: {
    badge: require('@/assets/images/rewards/gold-badge.png'),
    banner: require('@/assets/images/rewards/gold.png'),
    subtitle: 'Premium rewards with enhanced benefits',
  },
  platinum: {
    badge: require('@/assets/images/rewards/platinum-badge.png'),
    banner: require('@/assets/images/rewards/platinum.png'),
    subtitle: 'Elite rewards with maximum advantages',
  },
  silver: {
    badge: require('@/assets/images/rewards/silver-badge.png'),
    banner: require('@/assets/images/rewards/silver.png'),
    subtitle: 'Exclusive rewards for your investment journey',
  },
} as const;

const rewardTiers = [
  {
    aum: '₹1 Cr',
    aumLabel: '₹1 Crore Gold & Silver AUM',
    aumValue: 10_000_000,
    bg: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    color: 'text-gray-300',
    fd: '₹5 Lakh',
    metal: 'Silver',
  },
  {
    aum: '₹2 Cr',
    aumLabel: '₹2 Crore in Gold & Silver AUM',
    aumValue: 20_000_000,
    bg: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    color: 'text-yellow-500',
    fd: '₹10 Lakh',
    metal: 'Gold',
  },
  {
    aum: '₹3 Cr',
    aumLabel: '₹3 Crore in Gold & Silver AUM',
    aumValue: 30_000_000,
    bg: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
    color: 'text-purple-400',
    fd: '₹15 Lakh',
    metal: 'Platinum',
  },
];

export default function Rewards() {
  const { data: rewards, isLoading } = useRewards();
  const { data: referral } = useReferral();
  const [open, setOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const currentAmount = referral?.data?.totalData.totalAmount || 0;
  const milestones = [
    { amount: 10_000_000, left: '30%', metal: 'silver' },
    { amount: 20_000_000, left: '65%', metal: 'gold' },
    { amount: 30_000_000, left: '95%', metal: 'platinum' },
  ];

  const rewardPackages = rewards?.data ?? [];

  const getProgressWidth = () => {
    const last = rewardPackages.at(-1);

    if (!last) {
      return '15%';
    }

    return `${Math.min(
      (currentAmount / last.details.investment_amount) * 100,
      100
    )}%`;
  };
  const onRefresh = async () => {
    setRefreshing(true);

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['rewards'] }),
      queryClient.invalidateQueries({ queryKey: ['referral'] }),
    ]);

    setRefreshing(false);
  };
  return (
    <Profile.Container
      onRightActionPress={() => setOpen(true)}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
      }
      rightAction
    >
      <View className="p-3">
        <Card className="bg-surface overflow-hidden rounded-3xl p-5">
          <Text className="text-foreground text-sm">Total AUM</Text>

          <Text className="text-foreground mt-2 text-2xl font-extrabold">
            ₹{currentAmount.toLocaleString('en-IN')}
          </Text>

          <Text className="text-foreground mt-2 text-sm">
            Keep earning and win your dream trips
          </Text>

          <View className="mt-6">
            <View className="bg-background relative h-1.5 w-full rounded-full">
              <View
                className="bg-warning absolute top-0 left-0 h-1.5 rounded-full"
                style={{ width: getProgressWidth() }}
              />
            </View>
            <View className="relative h-10">
              {milestones.map((item) => {
                const completed = currentAmount >= item.amount;

                return (
                  <View
                    className="absolute items-center"
                    key={item.amount}
                    style={{
                      left: item.left,
                      top: -16,
                      transform: [
                        {
                          translateX: item.left === '100%' ? -24 : -18,
                        },
                      ],
                    }}
                  >
                    <View
                      className={`h-6 w-6 items-center justify-center rounded-full ${
                        completed ? 'bg-warning' : 'bg-background'
                      }`}
                    >
                      <Icon
                        color={completed ? 'success' : 'accent'}
                        icon={Check}
                        size="xs"
                        variants="soft"
                      />
                    </View>

                    <Text className="text-foreground mt-2 text-xs">
                      ₹ {(item.amount / 10_000_000).toFixed(0)} Cr
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Card>
      </View>

      <View className="px-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                className="mb-4 h-48 rounded-[30px]"
                isLoading
                key={index}
              >
                <View />
              </Skeleton>
            ))
          : rewardPackages.map((item) => {
              const asset = rewardAssets[item.id as keyof typeof rewardAssets];

              return (
                <RewardBanner
                  badge={asset.badge}
                  digitalGold={`₹ ${item.details.investment_label} in Digital Gold/Silver`}
                  fixedDeposit={`₹ ${item.details.fd_label} in Fixed Deposits`}
                  key={item.id}
                  source={asset.banner}
                  subTitle={asset.subtitle}
                  title={item.name}
                />
              );
            })}
      </View>

      <BottomSheet isOpen={open} onOpenChange={setOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay className="bg-black/70" />

          <BottomSheet.Content
            backgroundClassName="bg-background rounded-t-3xl"
            className="bg-background rounded-t-3xl px-4 pt-6"
            enableOverDrag={false}
            snapPoints={['40%', '80%']}
          >
            {/* Header */}
            <View className="mb-5 items-center">
              <BottomSheet.Title className="text-foreground text-center text-lg font-bold">
                Reward Tiers
              </BottomSheet.Title>
              <BottomSheet.Description className="text-foreground/60 mt-1 text-center text-sm">
                Build Your Business. Unlock Exclusive Rewards.
              </BottomSheet.Description>
            </View>

            {/* Tier Cards */}
            <View className="gap-4">
              {rewardTiers.map((tier, index) => {
                const completed = currentAmount >= tier.aumValue;

                return (
                  <View
                    className={`overflow-hidden rounded-2xl border ${tier.borderColor} ${tier.bg}`}
                    key={tier.aum}
                  >
                    <View className="flex-row items-start justify-between p-4">
                      <View className="flex-1">
                        {/* Metal Badge */}
                        <View className="bg-background/50 mb-3 self-start rounded-full px-3 py-1">
                          <Text className="text-foreground text-xs font-bold uppercase">
                            {tier.metal} Tier
                          </Text>
                        </View>

                        {/* Updated Instruction Text */}
                        <Text className="text-foreground/80 text-sm leading-relaxed">
                          Get your investors to invest{' '}
                          <Text className="text-foreground font-semibold">
                            {tier.aumLabel}
                          </Text>{' '}
                          and{' '}
                          <Text className="text-warning font-semibold">
                            {tier.fd}
                          </Text>{' '}
                          in Fixed Deposits to unlock this reward.
                        </Text>
                      </View>

                      {/* Status Icon */}
                      <View
                        className={`ml-3 h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          completed ? 'bg-success/20' : 'bg-foreground/5'
                        }`}
                      >
                        {completed ? (
                          <Icon
                            color="success"
                            icon={Check}
                            size="md"
                            variants="soft"
                          />
                        ) : (
                          <Text className="text-foreground/20 text-lg font-bold">
                            {index + 1}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Progress Indicator for this specific tier */}
                    <View className="bg-background/50 h-1 w-full">
                      <View
                        className={`h-1 ${
                          completed ? 'bg-success' : 'bg-foreground/10'
                        }`}
                        style={{
                          width: `${
                            completed
                              ? 100
                              : Math.min(
                                  (currentAmount / tier.aumValue) * 100,
                                  100
                                )
                          }%`,
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Footer Note */}
            <View className="bg-foreground/5 mt-6 rounded-xl p-4">
              <Text className="text-foreground/50 text-center text-xs">
                💡 Reward eligibility is based on achieving both Gold & Silver
                AUM and Fixed Deposit milestones. Rewards are unlocked
                automatically once the qualifying targets are achieved.
              </Text>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </Profile.Container>
  );
}
