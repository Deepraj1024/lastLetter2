/** biome-igore-all lint/style/noNestedTernary: will do */
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Building } from '@/components/icons/building';
import { Profile } from '@/components/profile';
import { useFdDetails } from '@/hooks/use-fd-details';

type FdDataPayload = NonNullable<
  ReturnType<typeof useFdDetails>['data']
>['data'];
type ProfileData = FdDataPayload['profile'];
type FdProfileData = FdDataPayload['fdProfile'];
type TotalData = FdDataPayload['totalData'];
type FdItemData = FdDataPayload['fdList'][number];

const formatDate = (date?: string) => {
  if (!date) {
    return 'N/A';
  }
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (date?: string) => {
  if (!date) {
    return 'N/A';
  }
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const DetailRow = ({
  label,
  value,
  isHighlight = false,
}: {
  label: string;
  value: string | number;
  isHighlight?: boolean;
}) => (
  <View className="border-border/10 flex-row items-center justify-between border-b py-3">
    <Text className="text-foreground/70 text-sm">{label}</Text>
    <Text
      className={`text-sm font-semibold ${
        isHighlight ? 'text-accent' : 'text-foreground'
      }`}
    >
      {value}
    </Text>
  </View>
);

const ProfileSummaryCard = ({
  profile,
  fdProfile,
}: {
  profile?: ProfileData;
  fdProfile?: FdProfileData;
}) => (
  <View className="bg-surface border-border/40 rounded-2xl border p-4">
    <Text className="text-foreground text-lg font-bold capitalize">
      {profile?.name ?? fdProfile?.fullName ?? 'N/A'}
    </Text>

    <View className="bg-foreground/5 mt-3 flex-row items-center justify-between rounded-xl p-3">
      <View>
        <Text className="text-foreground/70 text-[10px] tracking-wider uppercase">
          Joining Date
        </Text>
        <Text className="text-foreground mt-0.5 text-sm font-semibold">
          {formatDate(profile?.joiningDate)}
        </Text>
      </View>
      <View>
        <Text className="text-foreground/60 text-right text-[10px] tracking-wider uppercase">
          Onboarded
        </Text>
        <Text className="text-foreground mt-0.5 text-right text-sm font-semibold">
          {formatDateTime(fdProfile?.onboardingDate)}
        </Text>
      </View>
    </View>
  </View>
);

const StatsCard = ({ totalData }: { totalData?: TotalData }) => {
  const totalFd = totalData?.totalFdAmount ?? 0;
  const maturityAmount = totalData?.totalMaturityAmount ?? 0;
  const interestEarned = totalData?.totalInterestEarned ?? 0;

  return (
    <View className="bg-surface border-border/40 mt-4 rounded-2xl border p-4">
      <Text className="text-accent mb-2 text-sm font-bold tracking-wider uppercase">
        Portfolio Summary
      </Text>

      <DetailRow
        isHighlight
        label="Total FD Amount"
        value={`₹ ${totalFd.toLocaleString('en-IN')}`}
      />
      <DetailRow
        label="Total Maturity Amount"
        value={`₹ ${maturityAmount.toLocaleString('en-IN')}`}
      />
      <DetailRow
        label="Total Interest Earned"
        value={`₹ ${interestEarned.toLocaleString('en-IN')}`}
      />
      <DetailRow
        label="Active Fixed Deposits"
        value={totalData?.totalActiveFds ?? 0}
      />
      <DetailRow
        label="Matured Fixed Deposits"
        value={totalData?.totalMaturedFds ?? 0}
      />
    </View>
  );
};

const FdListItem = ({ item }: { item: FdItemData }) => (
  <View className="bg-surface border-border/40 mb-3 rounded-xl border p-3">
    <View className="flex-row items-center gap-3">
      <View className="bg-accent/10 h-10 w-10 items-center justify-center rounded-lg">
        <Icon color="accent" icon={Building} size="sm" withWrapper={false} />
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-sm font-bold">
          ₹ {(item.amount ?? 0).toLocaleString('en-IN')}
        </Text>
        <Text className="text-foreground/70 text-xs">
          Rate: {item.roi ?? 0}% • Tenure: {item.tenureDays ?? 0} Days
        </Text>
      </View>
    </View>

    <View className="border-border/10 mt-3 flex-row items-center justify-between border-t pt-3">
      <View>
        <Text className="text-foreground/70 text-[10px] tracking-wider uppercase">
          Booked On
        </Text>
        <Text className="text-foreground mt-0.5 text-xs font-semibold">
          {formatDateTime(item.createdAt)}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-foreground/70 text-right text-[10px] tracking-wider uppercase">
          Maturity Date
        </Text>
        <Text className="text-accent mt-0.5 text-right text-xs font-semibold">
          {formatDate(item.maturityDate)}
        </Text>
      </View>
    </View>
  </View>
);

const FdHistorySection = ({ fdList }: { fdList?: FdItemData[] }) => {
  if (!fdList || fdList.length === 0) {
    return null;
  }

  return (
    <View className="mt-4">
      <Text className="text-foreground/70 mb-2 px-1 text-sm font-bold tracking-wider uppercase">
        Fixed Deposits History
      </Text>
      {fdList.map((item, index) => (
        <FdListItem item={item} key={item.id ?? index.toString()} />
      ))}
    </View>
  );
};

export default function FDDetails() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data: fdDetails } = useFdDetails(userId);

  const payload = fdDetails?.data;

  if (!payload) {
    return (
      <Profile.Container title="Fixed Deposit">
        <View className="flex-1 items-center justify-center p-10">
          <Text className="text-foreground/70">Loading FD Portfolio...</Text>
        </View>
      </Profile.Container>
    );
  }

  return (
    <Profile.Container title="Fixed Deposit">
      <ScrollView className="flex-1 px-4 py-4">
        <ProfileSummaryCard
          fdProfile={payload.fdProfile}
          profile={payload.profile}
        />

        <StatsCard totalData={payload.totalData} />

        <FdHistorySection fdList={payload.fdList} />
      </ScrollView>
    </Profile.Container>
  );
}
