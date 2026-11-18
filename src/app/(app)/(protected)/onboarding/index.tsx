/** biome-ignore-all lint/style/noNestedTernary: <do it later> */
import { router } from 'expo-router';
import { Button } from 'heroui-native/button';
import { Skeleton } from 'heroui-native/skeleton';
import { useEffect } from 'react';
import { Image, RefreshControl, Text, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Lock } from '@/components/icons/lock';
import { Refresh } from '@/components/icons/refresh';
import { Profile } from '@/components/profile';
import { useUserStatus } from '@/hooks/use-user-status';

const Step = ({
  title,
  subtitle,
  status,
  type,
  isLast,
}: {
  title: string;
  subtitle: string;
  status: string;
  type: 'done' | 'active' | 'pending';
  isLast: boolean;
}) => {
  const isDone = type === 'done';
  const isActive = type === 'active';

  return (
    <View className="flex-row gap-x-4">
      <View className="items-center">
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isDone
              ? 'border-foreground border'
              : isActive
                ? 'border-warning border-2'
                : 'bg-black/20'
          }`}
        >
          {isDone && <Text className="text-foreground">✓</Text>}
          {isActive && <View className="bg-warning h-3 w-3 rounded-full" />}
          {!(isDone || isActive) && (
            <Icon icon={Lock} size="sm" variants="soft" withWrapper={false} />
          )}
        </View>

        {!isLast && <View className="bg-foreground/30 w-0.5 flex-1" />}
      </View>

      <View className="flex-1 pb-6">
        <Text
          className={`text-base font-semibold ${
            type === 'pending' ? 'text-foreground/50' : 'text-foreground'
          }`}
        >
          {title}
        </Text>

        <Text className="text-foreground/70 text-sm">{subtitle}</Text>
      </View>

      <View className="justify-center">
        <Text
          className={`text-sm font-semibold ${
            isDone
              ? 'text-success'
              : isActive
                ? 'text-warning'
                : 'text-foreground/60'
          }`}
        >
          {status}
        </Text>
      </View>
    </View>
  );
};

export default function OnBoarding() {
  const { data, isLoading, refetch, isRefetching } = useUserStatus();
  const agent = data?.agent;

  // Automatically navigate to home screen when user is fully approved
  useEffect(() => {
    if (agent?.userStatus === 'APPROVED') {
      router.replace('/(app)/(protected)/(tabs)/home');
    }
  }, [agent?.userStatus]);

  if (isLoading) {
    return (
      <Profile.Container>
        <View className="flex-1 items-center justify-center px-3">
          <Skeleton className="h-32 w-32 rounded-full" />

          <Skeleton className="mt-4 h-6 w-48 rounded-lg" />

          <Skeleton className="mt-2 h-4 w-72 rounded-lg" />
          <Skeleton className="mt-1 h-4 w-64 rounded-lg" />

          <View className="bg-surface mt-6 w-full rounded-3xl p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Skeleton className="h-5 w-40 rounded-lg" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </View>

            <View className="mb-6 flex-row gap-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />

              <View className="flex-1">
                <Skeleton className="h-4 w-40 rounded-lg" />
                <Skeleton className="mt-2 h-3 w-52 rounded-lg" />
              </View>

              <Skeleton className="h-4 w-16 rounded-lg" />
            </View>
          </View>
        </View>

        <Skeleton className="mx-4 mb-4 h-12 rounded-xl" />
      </Profile.Container>
    );
  }

  const isFullyApproved = agent?.userStatus === 'APPROVED';
  const isKycSuccess = agent?.kycStatus === 'SUCCESS';

  const kyc = isFullyApproved
    ? {
        status: 'DONE',
        subtitle: 'KYC completed successfully',
        type: 'done' as const,
      }
    : isKycSuccess
      ? {
          status: 'SUBMITTED',
          subtitle: 'KYC submitted successfully',
          type: 'done' as const,
        }
      : agent?.kycStatus === 'PENDING'
        ? {
            status: 'IN PROGRESS',
            subtitle: 'Verify your PAN / Aadhaar',
            type: 'active' as const,
          }
        : {
            status: 'PENDING',
            subtitle: 'KYC not started',
            type: 'pending' as const,
          };

  return (
    <Profile.Container
      refreshControl={
        <RefreshControl onRefresh={refetch} refreshing={isRefetching} />
      }
    >
      <View className="flex-1 items-center justify-center px-3">
        <Image
          className="h-32 w-32"
          resizeMode="contain"
          source={require('@/assets/images/chabi-onBoarding.png')}
        />

        <Text className="text-foreground mt-4 text-3xl font-bold">
          Profile Created!
        </Text>

        <Text className="text-foreground/60 mt-2 text-center">
          Your profile has been created successfully. Complete all the steps
          below to start earning
        </Text>

        <View className="bg-surface mt-6 w-full rounded-3xl p-4">
          <View className="flex-row justify-between">
            <Text className="text-foreground mb-4 text-lg font-semibold">
              Profile Activation Process
            </Text>

            <Icon
              color="background"
              icon={Refresh}
              size="md"
              withWrapper={false}
            />
          </View>

          <Step
            isLast={false}
            status="DONE"
            subtitle="Successfully created partner profile"
            title="Step 1: Profile Created"
            type="done"
          />

          <Step
            isLast={false}
            status={kyc.status}
            subtitle={kyc.subtitle}
            title="Step 2: KYC"
            type={kyc.type}
          />

          <Step
            isLast
            status={
              isFullyApproved ? 'DONE' : isKycSuccess ? 'IN REVIEW' : 'PENDING'
            }
            subtitle="Finalizing account and commission"
            title="Step 3: Account Activation"
            type={isFullyApproved ? 'done' : 'pending'}
          />
        </View>
      </View>

      <View className="items-center">
        {isFullyApproved ? (
          <Button
            className="mb-4 w-[85%] rounded-2xl"
            onPress={() => {
              router.replace('/(app)/(protected)/(tabs)/home');
            }}
            variant="tertiary"
          >
            <Button.Label className="text-text text-base">
              Continue to Dashboard
            </Button.Label>
          </Button>
        ) : isKycSuccess ? null : (
          <Button
            className="mb-4 w-[85%] rounded-2xl"
            onPress={() => {
              router.push('/(app)/(auth)/verification');
            }}
            variant="tertiary"
          >
            <Button.Label className="text-text text-base">
              Continue your KYC
            </Button.Label>
          </Button>
        )}
      </View>
    </Profile.Container>
  );
}
