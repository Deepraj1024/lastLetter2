import { useQueryClient } from '@tanstack/react-query';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useToast } from 'heroui-native/toast';
import { useCallback, useEffect, useRef } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ImageBackground } from '@/components/images';
import { Profile } from '@/components/profile';
import { VerificationCard } from '@/components/verificationCard';
import { useAadharStatus } from '@/hooks/use-aadhar';
import type { KycStatus } from '@/hooks/use-aadhar';
import {
  selectClearKid,
  selectHasHydrated,
  selectKid,
  selectSetKid,
  useKycStore,
} from '@/hooks/use-kyc-store';
import { useUserStatus } from '@/hooks/use-user-status';

const KYC_STATUS_LABEL: Record<KycStatus, string> = {
  approval_pending: 'Your Aadhaar KYC is under review',
  approved: 'Your Aadhaar has been verified',
  failed: 'Verification failed — please retry',
  rejected: 'Your Aadhaar KYC was rejected',
};

const KYC_STATUS_DESCRIPTION: Record<KycStatus, string> = {
  approval_pending:
    'This typically takes up to 24 hours. No action needed from your end.',
  approved: 'Your identity has been successfully verified with Digio.',
  failed: 'Something went wrong during verification. Please try again.',
  rejected: 'Please contact support or retry with a valid Aadhaar document.',
};

const KYC_STATUS_STYLES: Record<
  KycStatus,
  { banner: string; dot: string; label: string; description: string }
> = {
  approval_pending: {
    banner: 'border-warning/30 bg-warning/10',
    description: 'text-foreground/60',
    dot: 'bg-warning animate-pulse',
    label: 'text-warning',
  },
  approved: {
    banner: 'border-success/30 bg-success/10',
    description: 'text-foreground/60',
    dot: 'bg-success',
    label: 'text-success',
  },
  failed: {
    banner: 'border-danger/30 bg-danger/10',
    description: 'text-foreground/60',
    dot: 'bg-danger',
    label: 'text-danger',
  },
  rejected: {
    banner: 'border-danger/30 bg-danger/10',
    description: 'text-foreground/60',
    dot: 'bg-danger',
    label: 'text-danger',
  },
};

const KycStatusBanner = ({ status }: { status: KycStatus }) => {
  const styles = KYC_STATUS_STYLES[status];

  return (
    <View className={`mt-4 rounded-2xl border p-4 ${styles.banner}`}>
      <View className="flex-row items-center gap-x-3">
        <View className={`size-2.5 rounded-full ${styles.dot}`} />
        <Text className={`flex-1 text-sm font-semibold ${styles.label}`}>
          {KYC_STATUS_LABEL[status]}
        </Text>
      </View>
      <Text
        className={`mt-2 ml-5 text-xs leading-relaxed ${styles.description}`}
      >
        {KYC_STATUS_DESCRIPTION[status]}
      </Text>
    </View>
  );
};

const AgeEligibilityBanner = ({
  message,
  onTryAgain,
}: {
  message: string;
  onTryAgain: () => void;
}) => (
  <View className="border-danger/30 bg-danger/10 mt-4 rounded-2xl border p-4">
    <View className="flex-row items-center gap-x-3">
      <View className="bg-danger size-2.5 rounded-full" />
      <Text className="text-danger flex-1 text-sm font-semibold">
        Age Eligibility Check Failed
      </Text>
    </View>

    <View className="mt-3 ml-5 flex-row items-center gap-x-2">
      <View className="border-danger/40 bg-danger/20 rounded-full border px-3 py-1">
        <Text className="text-danger text-sm font-bold">18+</Text>
      </View>
      <Text className="text-danger/80 text-xs font-medium">
        Minimum age required
      </Text>
    </View>

    <Text className="text-foreground/60 mt-2 ml-5 text-xs leading-relaxed">
      {message}
    </Text>

    <TouchableOpacity
      activeOpacity={0.7}
      className="bg-danger/20 mt-4 ml-5 self-start rounded-xl px-5 py-2.5"
      onPress={onTryAgain}
    >
      <Text className="text-danger text-xs font-semibold">Try Again</Text>
    </TouchableOpacity>
  </View>
);

// oxlint-disable-next-line complexity
export default function Verification() {
  const { kid: kidFromParams } = useLocalSearchParams<{ kid?: string }>();

  const storedKid = useKycStore(selectKid);
  const hasHydrated = useKycStore(selectHasHydrated);
  const setKid = useKycStore(selectSetKid);
  const clearKid = useKycStore(selectClearKid);

  // Seed the store from the route param once (Digio hands the kid back via
  // navigation). The guard `storedKid === null` keeps this strictly
  // one-directional: after a terminal result clears the kid it must NOT be
  // resurrected by the still-present route param (that ping-pong caused an
  // infinite update loop).
  useEffect(() => {
    if (kidFromParams && storedKid === null) {
      setKid(kidFromParams);
    }
  }, [kidFromParams, storedKid, setKid]);

  const kid = kidFromParams ?? (hasHydrated ? storedKid : undefined);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // A terminal result for a given kid must be handled once — prevents
  // repeated navigation/toasts and any set/clear kid feedback loop.
  const handledKidRef = useRef<string | null>(null);

  const {
    data: userStatus,
    refetch: refetchUserStatus,
    isRefetching,
  } = useUserStatus();

  const {
    data: aadharStatus,
    isFetching: isKycFetching,
    refetch: refetchAadharStatus,
    error,
  } = useAadharStatus(kid ?? undefined);

  console.log('aadhar card data:', aadharStatus);
  console.log('aadhar card status error:', error);

  const isAgeIneligible =
    !!kid &&
    aadharStatus?.success === false &&
    aadharStatus?.isMinAgeEligible === false;

  const ageIneligibleMessage =
    aadharStatus?.message ??
    'You must be at least 18 years old to complete Aadhaar KYC.';

  // Refresh data when the screen comes back into focus (reactive handling
  // lives in the effects below — this callback must not read status, its
  // closure would be stale).
  useFocusEffect(
    useCallback(() => {
      refetchUserStatus();
      refetchAadharStatus();
    }, [refetchAadharStatus, refetchUserStatus])
  );

  // React to a fresh KYC status. Runs when the response changes; each kid is
  // handled once, and terminal results strip the route param so the sync
  // effect above cannot resurrect the kid.
  useEffect(() => {
    const status = aadharStatus?.kyc_status;
    const success = aadharStatus?.success;

    if (success === undefined || !kid || handledKidRef.current === kid) {
      return;
    }

    if (success && status === 'approved') {
      handledKidRef.current = kid;
      queryClient.invalidateQueries({ queryKey: ['user-status'] });
      clearKid();
      router.replace('/(app)/(auth)/onBoarding');
      return;
    }

    if (success && (status === 'rejected' || status === 'failed')) {
      handledKidRef.current = kid;
      clearKid();
      // Drop the ?kid param so polling stops and the kid is not re-seeded.
      router.replace('/(app)/(auth)/verification');
      return;
    }

    if (success === false) {
      // Under-age keeps the kid so the banner can show; its "Try Again"
      // navigates without the param.
      if (isAgeIneligible) {
        handledKidRef.current = kid;
        return;
      }

      // Any other business failure (kid not found, already linked, etc.) —
      // alert once, drop the kid, and strip the route param.
      handledKidRef.current = kid;
      clearKid();
      toast.show({
        description:
          aadharStatus?.message ??
          'Aadhaar verification failed. Please try again.',
        label: 'Verification Failed',
        variant: 'danger',
      });
      router.replace('/(app)/(auth)/verification');
    }
  }, [
    aadharStatus?.kyc_status,
    aadharStatus?.message,
    aadharStatus?.success,
    clearKid,
    isAgeIneligible,
    kid,
    queryClient,
    toast,
  ]);

  const kycStatus = aadharStatus?.kyc_status;
  const isAadharVerified = userStatus?.agent?.aadhaarVerified;

  const showKycBanner =
    !!kid && aadharStatus?.success === true && kycStatus !== undefined;

  const isAadharActionBlocked = !!kid || isAadharVerified;

  const isAadharFetchingStatus = !!kid && isKycFetching;

  const handleAgeErrorTryAgain = () => {
    clearKid();
    handledKidRef.current = null;
    // Drop the ?kid param so the kid is not re-seeded on the next focus.
    router.replace('/(app)/(auth)/verification');
  };

  return (
    <Profile.Container scrollable={false}>
      <View className="absolute inset-x-0 -top-4 overflow-hidden rounded-b-4xl">
        <ImageBackground
          className="h-64 w-full justify-end"
          contentFit="cover"
          contentPosition="center"
          source={require('@/assets/images/background.png')}
        >
          <View className="px-4 pb-6">
            <Text className="text-foreground text-4xl font-bold">
              Complete your KYC
            </Text>
            <Text className="text-foreground/80 mt-2 text-sm leading-relaxed">
              To comply with regulatory guidelines, we need to verify your
              identity. This is a quick and secure process powered by Digio.
            </Text>
          </View>
        </ImageBackground>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="mt-44 px-4 pb-10"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            onRefresh={refetchUserStatus}
            refreshing={isRefetching}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-foreground mt-4 mb-2 text-base font-bold">
          Verify your PAN Card
        </Text>

        <VerificationCard
          onPress={() => {
            if (!userStatus?.agent?.panVerified) {
              router.push('/(app)/(auth)/panVerification');
            }
          }}
          title="PAN Card"
          verified={userStatus?.agent?.panVerified}
        />

        <View className="bg-foreground/10 my-4 h-px w-full" />

        <Text className="text-foreground mb-2 text-base font-bold">
          Verify your Aadhaar
        </Text>

        <VerificationCard
          isDisabled={isAadharFetchingStatus || isAadharActionBlocked}
          isLoading={isAadharFetchingStatus}
          onPress={() => {
            if (!isAadharActionBlocked) {
              router.push('/(app)/(auth)/aadharVerification');
            }
          }}
          title="Aadhaar Number"
          verified={isAadharVerified}
        />

        {isAgeIneligible && (
          <AgeEligibilityBanner
            message={ageIneligibleMessage}
            onTryAgain={handleAgeErrorTryAgain}
          />
        )}

        {showKycBanner && kycStatus && <KycStatusBanner status={kycStatus} />}
      </ScrollView>
    </Profile.Container>
  );
}
