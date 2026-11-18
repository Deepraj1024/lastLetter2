/** biome-ignore-all lint/style/noNestedTernary: will do */
import { router } from 'expo-router';
import { Card } from 'heroui-native';
import { BottomSheet } from 'heroui-native/bottom-sheet';
import { PressableFeedback } from 'heroui-native/pressable-feedback';
import { SearchField } from 'heroui-native/search-field';
import { Skeleton } from 'heroui-native/skeleton';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { Container } from '@/components/container';
import { Icon } from '@/components/icons';
import { Building } from '@/components/icons/building';
import { Coins } from '@/components/icons/coins';
import { Filter } from '@/components/icons/filter';
import { Search } from '@/components/icons/search';
import { useFdReferral } from '@/hooks/use-fd-referrals';
import { useReferral } from '@/hooks/use-referral';
import { useReferralUser } from '@/hooks/use-referral-user';

type TabType = 'metal' | 'fd';
type StatusType = 'invested' | 'non-invested' | '';
type SortType = 'asc' | 'desc';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const CardSkeleton = () => (
  <View className="bg-surface mb-3 rounded-2xl p-4">
    <View className="flex-row items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <View className="flex-1">
        <Skeleton className="h-5 w-32 rounded-lg" />
        <Skeleton className="mt-2 h-3 w-24 rounded-lg" />
      </View>
      <Skeleton className="h-7 w-20 rounded-lg" />
    </View>
  </View>
);

const SkeletonList = () => (
  <>
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </>
);

const EmptyState = ({ icon, message }: { icon: any; message: string }) => (
  <View className="mt-10 items-center justify-center">
    <View className="bg-surface h-16 w-16 items-center justify-center rounded-full">
      <Icon color="accent" icon={icon} size="sm" withWrapper={false} />
    </View>
    <Text className="text-foreground/70 mt-3 text-center">{message}</Text>
  </View>
);

const MetalUserCard = ({
  item,
}: {
  item: {
    userId: string;
    name: string;
    joined: string;
    amount: string | null;
    invested: boolean;
  };
}) => (
  <PressableFeedback
    className="bg-surface border-border/40 mb-3 rounded-2xl border p-4"
    onPress={() =>
      router.push({
        params: { userId: item.userId },
        pathname: '/(app)/(protected)/customer-id',
      })
    }
  >
    <View className="flex-row items-center gap-3">
      <View className="bg-accent/10 h-12 w-12 items-center justify-center rounded-full">
        <Icon color="accent" icon={Coins} size="sm" withWrapper={false} />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-foreground text-base font-bold capitalize"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-foreground/60 mt-0.5 text-xs">
          Joined {item.joined}
        </Text>
      </View>

      <View className="items-end">
        {item.invested ? (
          <>
            <Text className="text-foreground/70 text-[10px] uppercase">
              Invested
            </Text>
            <Text className="text-accent text-lg font-bold" numberOfLines={1}>
              {item.amount}
            </Text>
          </>
        ) : (
          <View className="bg-foreground/10 rounded-full px-3 py-1.5">
            <Text className="text-foreground/60 text-xs font-semibold">
              Not invested
            </Text>
          </View>
        )}
      </View>
    </View>
  </PressableFeedback>
);

const FdUserCard = ({
  item,
}: {
  item: {
    userId: string;
    name: string;
    joined: string;
    hasFd: boolean;
    totalFdAmount: number;
    activeFdCount: number;
  };
}) => (
  <PressableFeedback
    className="bg-surface border-border/40 mb-3 rounded-2xl border p-4"
    onPress={() =>
      router.push({
        params: { userId: item.userId },
        pathname: '/(app)/(protected)/fd-details',
      })
    }
  >
    <View className="flex-row items-center gap-3">
      <View className="bg-accent/10 h-12 w-12 items-center justify-center rounded-xl">
        <Icon color="accent" icon={Building} size="sm" withWrapper={false} />
      </View>

      <View className="min-w-0 flex-1">
        <Text
          className="text-foreground text-base font-bold capitalize"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-foreground/60 mt-0.5 text-xs">
          Joined {item.joined}
        </Text>
      </View>

      <View className="items-end">
        {item.hasFd ? (
          <>
            <View className="bg-accent/10 rounded-full px-2 py-0.5">
              <Text className="text-accent text-[10px] font-semibold uppercase">
                {item.activeFdCount} Active FD
              </Text>
            </View>
            <Text
              className="text-accent mt-1 text-lg font-bold"
              numberOfLines={1}
            >
              ₹ {item.totalFdAmount.toLocaleString('en-IN')}
            </Text>
          </>
        ) : (
          <View className="bg-foreground/10 rounded-full px-3 py-1.5">
            <Text className="text-foreground/60 text-xs font-semibold">
              No FD yet
            </Text>
          </View>
        )}
      </View>
    </View>
  </PressableFeedback>
);

const TabBar = ({
  activeTab,
  onChange,
}: {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}) => {
  const isMetal = activeTab === 'metal';
  return (
    <View className="mx-2 flex-row gap-2 rounded-2xl p-1.5">
      <PressableFeedback
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
          isMetal ? 'bg-accent' : 'bg-surface'
        }`}
        onPress={() => onChange('metal')}
      >
        <Icon
          color={isMetal ? 'accent' : 'background'}
          icon={Coins}
          size="sm"
          withWrapper={false}
        />
        <Text
          className={`font-bold ${isMetal ? 'text-foreground' : 'text-accent'}`}
        >
          Metal
        </Text>
      </PressableFeedback>

      <PressableFeedback
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
          isMetal ? 'bg-surface' : 'bg-accent'
        }`}
        onPress={() => onChange('fd')}
      >
        <Icon
          color={isMetal ? 'background' : 'accent'}
          icon={Building}
          size="sm"
          withWrapper={false}
        />
        <Text
          className={`font-bold ${isMetal ? 'text-accent' : 'text-foreground'}`}
        >
          Fixed Deposit
        </Text>
      </PressableFeedback>
    </View>
  );
};

const HeroStat = ({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: number;
  isLoading: boolean;
}) => (
  <View className="flex-1">
    <Text className="text-foreground/70 text-xs">{label}</Text>
    <Skeleton className="mt-1 h-8 w-16 rounded-lg" isLoading={isLoading}>
      <Text className="text-foreground text-3xl font-bold">{value}</Text>
    </Skeleton>
  </View>
);

const HeroCard = ({
  isMetalTab,
  totalInvitations,
  totalActiveReferrals,
  fdSummary,
  isReferralLoading,
  isFdLoading,
}: {
  isMetalTab: boolean;
  totalInvitations: number;
  totalActiveReferrals: number;
  fdSummary: any;
  isReferralLoading: boolean;
  isFdLoading: boolean;
}) => {
  const isLoading = isMetalTab ? isReferralLoading : isFdLoading;
  const primaryValue = isMetalTab
    ? totalInvitations
    : (fdSummary?.totalReferrals ?? 0);
  const secondaryValue = isMetalTab
    ? totalActiveReferrals
    : (fdSummary?.totalWithFd ?? 0);

  return (
    <Card className="mx-2 mt-4 overflow-hidden rounded-3xl p-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-accent text-sm">
            {isMetalTab ? 'Metal Investors' : 'Fixed Deposit Investors'}
          </Text>
          <Text className="text-foreground mt-1 text-xs">
            {isMetalTab
              ? 'Overview of your metal referrals'
              : 'Overview of your FD referrals'}
          </Text>
        </View>

        <View className="bg-background/15 h-12 w-12 items-center justify-center rounded-2xl">
          <Icon
            color="accent"
            icon={isMetalTab ? Coins : Building}
            size="sm"
            withWrapper={false}
          />
        </View>
      </View>

      <View className="mt-5 flex-row items-end justify-between">
        <HeroStat
          isLoading={isLoading}
          label="Total Invitations"
          value={primaryValue}
        />

        <View className="bg-background/20 h-10 w-px" />

        <View className="flex-1 pl-4">
          <HeroStat
            isLoading={isLoading}
            label={isMetalTab ? 'Active Investors' : 'Active FDs'}
            value={secondaryValue}
          />
        </View>
      </View>

      {!isMetalTab && (
        <View className="bg-border mt-4 rounded-xl p-3">
          <Text className="text-foreground text-[10px] uppercase">
            Total FD Amount
          </Text>
          <Skeleton
            className="mt-1 h-6 w-32 rounded-lg"
            isLoading={isFdLoading}
          >
            <Text className="text-foreground text-xl font-bold">
              ₹ {(fdSummary?.totalFdAmount ?? 0).toLocaleString('en-IN')}
            </Text>
          </Skeleton>
        </View>
      )}
    </Card>
  );
};

const SearchBar = ({
  search,
  onSearchChange,
  onFilterPress,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onFilterPress: () => void;
}) => (
  <View className="mt-4 flex-row items-center gap-2 px-2">
    <View className="flex-1">
      <SearchField>
        <SearchField.Group className="bg-surface rounded-xl">
          <SearchField.SearchIcon>
            <Icon color="accent" icon={Search} size="sm" withWrapper={false} />
          </SearchField.SearchIcon>

          <SearchField.Input
            className="text-foreground flex-1 border-0 text-base"
            onChange={(e) => onSearchChange(e.nativeEvent.text)}
            placeholder="Search Metal Investor"
            value={search}
          />
        </SearchField.Group>
      </SearchField>
    </View>

    <PressableFeedback
      className="border-border bg-surface h-14 w-14 items-center justify-center rounded-xl border"
      onPress={onFilterPress}
    >
      <Icon color="accent" icon={Filter} size="sm" withWrapper={false} />
    </PressableFeedback>
  </View>
);

const SectionHeader = ({ isMetalTab }: { isMetalTab: boolean }) => (
  <View className="mt-4 flex-row items-center justify-between px-4">
    <View className="flex-row items-center">
      <Text className="text-accent text-sm font-bold">
        {isMetalTab ? 'Metal Investor' : 'Fixed Deposit Investor'}
      </Text>
    </View>
  </View>
);

const MetalList = ({
  isLoading,
  users,
}: {
  isLoading: boolean;
  users: any[];
}) => {
  if (isLoading) {
    return <SkeletonList />;
  }
  if (users.length === 0) {
    return <EmptyState icon={Coins} message="No Metal investors yet" />;
  }

  return (
    <>
      {users.map((item) => (
        <MetalUserCard
          item={{
            amount: item.isInvested
              ? `₹ ${item.totalInvestment.toLocaleString('en-IN')}`
              : null,
            invested: item.isInvested,
            joined: formatDate(item.joiningDate),
            name: item.name,
            userId: item.userId,
          }}
          key={item.userId}
        />
      ))}
    </>
  );
};

const FdList = ({ isLoading, users }: { isLoading: boolean; users: any[] }) => {
  if (isLoading) {
    return <SkeletonList />;
  }
  if (users.length === 0) {
    return <EmptyState icon={Building} message="No FD investors yet" />;
  }

  return (
    <>
      {users.map((item) => (
        <FdUserCard
          item={{
            activeFdCount: item.activeFdCount,
            hasFd: item.hasFd,
            joined: formatDate(item.joiningDate),
            name: item.name,
            totalFdAmount: item.totalFdAmount,
            userId: item.userId,
          }}
          key={item.userId}
        />
      ))}
    </>
  );
};

const StatusChip = ({
  label,
  value,
  activeValue,
  onPress,
}: {
  label: string;
  value: StatusType;
  activeValue: StatusType;
  onPress: (v: StatusType) => void;
}) => {
  const isActive = activeValue === value;
  return (
    <PressableFeedback
      className={`rounded-full border px-5 py-3 ${
        isActive ? 'border-accent bg-accent' : 'border-foreground/10 bg-surface'
      }`}
      onPress={() => onPress(value)}
    >
      <Text
        className={`font-medium ${
          isActive ? 'text-background' : 'text-foreground'
        }`}
      >
        {label}
      </Text>
    </PressableFeedback>
  );
};

const SortOption = ({
  title,
  subtitle,
  value,
  activeValue,
  onPress,
}: {
  title: string;
  subtitle: string;
  value: SortType;
  activeValue: SortType;
  onPress: (v: SortType) => void;
}) => {
  const isActive = activeValue === value;
  return (
    <PressableFeedback
      className={`flex-row items-center justify-between rounded-2xl border p-4 ${
        isActive
          ? 'border-accent bg-accent/10'
          : 'border-foreground/10 bg-surface'
      }`}
      onPress={() => onPress(value)}
    >
      <View>
        <Text className="text-foreground font-semibold">{title}</Text>
        <Text className="text-foreground/70 mt-1 text-xs">{subtitle}</Text>
      </View>
      {isActive && <View className="bg-accent h-3 w-3 rounded-full" />}
    </PressableFeedback>
  );
};

const FilterSheet = ({
  isOpen,
  onClose,
  status,
  setStatus,
  sortOrder,
  setSortOrder,
}: {
  isOpen: boolean;
  onClose: () => void;
  status: StatusType;
  setStatus: (s: StatusType) => void;
  sortOrder: SortType;
  setSortOrder: (s: SortType) => void;
}) => (
  <BottomSheet isOpen={isOpen} onOpenChange={onClose}>
    <BottomSheet.Portal>
      <BottomSheet.Overlay className="bg-black/50" />
      <BottomSheet.Content
        backgroundClassName="bg-background"
        className="px-5 pb-8"
      >
        <BottomSheet.Title className="text-foreground text-center text-xl font-bold">
          Filter Metal Investors
        </BottomSheet.Title>

        <Text className="text-foreground/70 mt-1 text-center text-sm">
          Refine your list
        </Text>

        <View className="mt-8">
          <Text className="text-foreground mb-3 text-base font-semibold">
            Status
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <StatusChip
              activeValue={status}
              label="All"
              onPress={setStatus}
              value=""
            />
            <StatusChip
              activeValue={status}
              label="Invested"
              onPress={setStatus}
              value="invested"
            />
            <StatusChip
              activeValue={status}
              label="Not Invested"
              onPress={setStatus}
              value="non-invested"
            />
          </View>
        </View>

        <View className="mt-8">
          <Text className="text-foreground mb-3 text-base font-semibold">
            Sort Amount
          </Text>

          <View className="gap-3">
            <SortOption
              activeValue={sortOrder}
              onPress={setSortOrder}
              subtitle="Largest amount at the top"
              title="Highest First"
              value="desc"
            />
            <SortOption
              activeValue={sortOrder}
              onPress={setSortOrder}
              subtitle="Smallest amount at the top"
              title="Lowest First"
              value="asc"
            />
          </View>
        </View>

        <PressableFeedback
          className="bg-surface mt-8 items-center rounded-2xl py-4"
          onPress={onClose}
        >
          <Text className="text-foreground font-bold">Apply Filters</Text>
        </PressableFeedback>
      </BottomSheet.Content>
    </BottomSheet.Portal>
  </BottomSheet>
);

export default function Customer() {
  const [activeTab, setActiveTab] = useState<TabType>('metal');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusType>('');
  const [sortOrder, setSortOrder] = useState<SortType>('desc');

  const {
    data: referralData,
    isLoading: isReferralLoading,
    refetch: refetchReferral,
  } = useReferral();

  const {
    data: referralsUser,
    isLoading: isReferralUserLoading,
    refetch: refetchReferralUsers,
  } = useReferralUser({
    search,
    sortBy: 'amount',
    sortorder: sortOrder,
    status,
  });

  const {
    data: fdReferrals,
    isLoading: isFdLoading,
    refetch: refetchFdReferrals,
  } = useFdReferral();
  console.log('fddddd', fdReferrals);

  const totalInvitations = referralData?.data.totalData.totalReferrals ?? 0;
  const totalActiveReferrals =
    referralData?.data.totalData.totalActiveReferrals ?? 0;
  const fdSummary = fdReferrals?.summary;
  const fdList = fdReferrals?.data ?? [];
  const metalList = referralsUser?.data ?? [];

  const isRefreshing =
    isReferralLoading || isReferralUserLoading || isFdLoading;
  const isMetalTab = activeTab === 'metal';

  const onRefresh = useCallback(async () => {
    try {
      await Promise.all([
        refetchReferral(),
        refetchReferralUsers(),
        refetchFdReferrals(),
      ]);
    } catch (error) {
      console.log('Refresh Error:', error);
    }
  }, [refetchReferral, refetchReferralUsers, refetchFdReferrals]);

  return (
    <Container
      refreshControl={
        <RefreshControl
          colors={['#0066FF']}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
      }
    >
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      <HeroCard
        fdSummary={fdSummary}
        isFdLoading={isFdLoading}
        isMetalTab={isMetalTab}
        isReferralLoading={isReferralLoading}
        totalActiveReferrals={totalActiveReferrals}
        totalInvitations={totalInvitations}
      />

      {isMetalTab && (
        <SearchBar
          onFilterPress={() => setIsFilterOpen(true)}
          onSearchChange={setSearch}
          search={search}
        />
      )}

      <SectionHeader isMetalTab={isMetalTab} />

      <ScrollView className="mt-3 px-2">
        {isMetalTab ? (
          <MetalList isLoading={isReferralUserLoading} users={metalList} />
        ) : (
          <FdList isLoading={isFdLoading} users={fdList} />
        )}
      </ScrollView>

      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        setSortOrder={setSortOrder}
        setStatus={setStatus}
        sortOrder={sortOrder}
        status={status}
      />
    </Container>
  );
}
