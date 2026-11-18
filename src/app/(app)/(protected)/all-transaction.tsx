import { LegendList } from '@legendapp/list/react-native';
import { BottomSheet } from 'heroui-native/bottom-sheet';
import { PressableFeedback } from 'heroui-native/pressable-feedback';
import { SearchField } from 'heroui-native/search-field';
import { Skeleton } from 'heroui-native/skeleton';
import { useCallback, useMemo, useReducer } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { Icon } from '@/components/icons';
import { Coins } from '@/components/icons/coins';
import { Cross } from '@/components/icons/cross';
import { Filter } from '@/components/icons/filter';
import { Search } from '@/components/icons/search';
import { Profile } from '@/components/profile';
import { useRecentTransactionInfinite } from '@/hooks/use-recent-transaction';

const LIMIT = 15;
const MetalType = { GOLD: 'gold', SILVER: 'silver' } as const;
type MetalTypeValue = (typeof MetalType)[keyof typeof MetalType];

const metalConfig: Record<
  MetalTypeValue,
  { bgColor: string; color: 'warning' | 'default' }
> = {
  [MetalType.GOLD]: { bgColor: 'bg-warning/10', color: 'warning' },
  [MetalType.SILVER]: { bgColor: 'bg-foreground/10', color: 'default' },
};

const MONTHS = [
  { label: 'Jan', value: 1 },
  { label: 'Feb', value: 2 },
  { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 },
  { label: 'May', value: 5 },
  { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 },
  { label: 'Aug', value: 8 },
  { label: 'Sep', value: 9 },
  { label: 'Oct', value: 10 },
  { label: 'Nov', value: 11 },
  { label: 'Dec', value: 12 },
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;
const YEARS = [CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

const FilterMode = {
  MONTH_YEAR: 'month_year',
  YEAR_ONLY: 'year_only',
} as const;
type FilterModeValue = (typeof FilterMode)[keyof typeof FilterMode];

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

interface FilterValues {
  mode: FilterModeValue;
  name: string;
  month: number;
  year: number;
}

interface PageState {
  search: string;
  draftFilter: FilterValues;
  appliedFilter: FilterValues;
  isFilterOpen: boolean;
}

type PageAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SUBMIT_SEARCH' }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'OPEN_FILTER' }
  | { type: 'CLOSE_FILTER' }
  | { type: 'SET_FILTER_MODE'; payload: FilterModeValue }
  | { type: 'SET_FILTER_MONTH'; payload: number }
  | { type: 'SET_FILTER_YEAR'; payload: number }
  | { type: 'APPLY_FILTER' }
  | { type: 'RESET_FILTER' };

// DEFAULT SET TO YEAR-WISE
const initialFilterValues: FilterValues = {
  mode: FilterMode.YEAR_ONLY,
  month: CURRENT_MONTH,
  name: '',
  year: CURRENT_YEAR,
};

const initialState: PageState = {
  appliedFilter: initialFilterValues,
  draftFilter: initialFilterValues,
  isFilterOpen: false,
  search: '',
};
const FilterSheet = ({
  isOpen,
  onOpenChange,
  filterMode,
  filterMonth,
  filterYear,
  filterName,
  onChangeMode,
  onToggleMonth,
  onToggleYear,
  onReset,
  onApply,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filterMode: FilterModeValue;
  filterMonth: number;
  filterYear: number;
  filterName: string;
  onChangeMode: (mode: FilterModeValue) => void;
  onToggleMonth: (value: number) => void;
  onToggleYear: (value: number) => void;
  onReset: () => void;
  onApply: () => void;
}) => {
  const filterLabel = useMemo(() => {
    const parts: string[] = [];
    if (filterMode === FilterMode.MONTH_YEAR) {
      const monthLabel = MONTHS.find((m) => m.value === filterMonth)?.label;
      if (monthLabel) {
        parts.push(monthLabel);
      }
    } else {
      parts.push('Full Year');
    }
    parts.push(filterYear.toString());
    if (filterName) {
      parts.push(`"${filterName}"`);
    }
    return parts.join(', ');
  }, [filterMode, filterMonth, filterYear, filterName]);

  const isMonthYearMode = filterMode === FilterMode.MONTH_YEAR;

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay className="bg-black/50" />
        <BottomSheet.Content
          backgroundClassName="bg-background"
          className="px-5 pb-8"
        >
          <BottomSheet.Title className="text-foreground text-center text-lg font-bold">
            Filter Transactions
          </BottomSheet.Title>
          <Text className="text-foreground/70 mt-1 text-center text-xs">
            Filter transactions by time boundaries
          </Text>

          {/* Mode Selector (Default: Full Year) */}
          <View className="bg-surface mt-5 flex-row rounded-xl p-1">
            <PressableFeedback
              className={`flex-1 items-center rounded-lg py-2 ${isMonthYearMode ? 'bg-transparent' : 'bg-accent'}`}
              onPress={() => onChangeMode(FilterMode.YEAR_ONLY)}
            >
              <Text
                className={`text-xs font-semibold ${isMonthYearMode ? 'text-foreground/70' : 'text-background'}`}
              >
                Full Year
              </Text>
            </PressableFeedback>
            <PressableFeedback
              className={`flex-1 items-center rounded-lg py-2 ${isMonthYearMode ? 'bg-accent' : 'bg-transparent'}`}
              onPress={() => onChangeMode(FilterMode.MONTH_YEAR)}
            >
              <Text
                className={`text-xs font-semibold ${isMonthYearMode ? 'text-background' : 'text-foreground/70'}`}
              >
                Month + Year
              </Text>
            </PressableFeedback>
          </View>

          {isMonthYearMode && (
            <View className="mt-6">
              <Text className="text-foreground mb-2 text-sm font-semibold">
                Select Month
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {MONTHS.map((month) => {
                  const isSelected = filterMonth === month.value;
                  return (
                    <PressableFeedback
                      className={`rounded-full border px-3.5 py-2 ${
                        isSelected
                          ? 'border-accent bg-accent'
                          : 'border-foreground/10 bg-surface'
                      }`}
                      key={month.value}
                      onPress={() => onToggleMonth(month.value)}
                    >
                      <Text
                        className={`text-xs font-medium ${isSelected ? 'text-background' : 'text-foreground'}`}
                      >
                        {month.label}
                      </Text>
                    </PressableFeedback>
                  );
                })}
              </View>
            </View>
          )}

          {/* Year Grid */}
          <View className="mt-6">
            <Text className="text-foreground mb-2 text-sm font-semibold">
              Select Year
            </Text>
            <View className="flex-row gap-2">
              {YEARS.map((year) => {
                const isSelected = filterYear === year;
                return (
                  <PressableFeedback
                    className={`flex-1 rounded-xl border py-2.5 ${
                      isSelected
                        ? 'border-accent bg-accent'
                        : 'border-foreground/10 bg-surface'
                    }`}
                    key={year}
                    onPress={() => onToggleYear(year)}
                  >
                    <Text
                      className={`text-center text-sm font-semibold ${isSelected ? 'text-background' : 'text-foreground'}`}
                    >
                      {year}
                    </Text>
                  </PressableFeedback>
                );
              })}
            </View>
          </View>

          <View className="bg-accent/10 mt-4 rounded-xl p-3">
            <Text className="text-accent text-xs font-medium">
              Active: {filterLabel}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="mt-6 flex-row gap-3">
            <PressableFeedback
              className="border-foreground/10 bg-surface flex-1 items-center rounded-xl border py-3"
              onPress={onReset}
            >
              <Text className="text-foreground text-sm font-semibold">
                Reset
              </Text>
            </PressableFeedback>
            <PressableFeedback
              className="bg-accent flex-1 items-center rounded-xl py-3"
              onPress={onApply}
            >
              <Text className="text-background text-sm font-bold">
                Apply Filters
              </Text>
            </PressableFeedback>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
};

const pageReducer = (state: PageState, action: PageAction): PageState => {
  switch (action.type) {
    case 'SET_SEARCH': {
      return { ...state, search: action.payload };
    }
    case 'SUBMIT_SEARCH': {
      return {
        ...state,
        appliedFilter: { ...state.appliedFilter, name: state.search },
        draftFilter: { ...state.draftFilter, name: state.search },
      };
    }
    case 'CLEAR_SEARCH': {
      return {
        ...state,
        appliedFilter: { ...state.appliedFilter, name: '' },
        draftFilter: { ...state.draftFilter, name: '' },
        search: '',
      };
    }
    case 'OPEN_FILTER': {
      return {
        ...state,
        draftFilter: { ...state.appliedFilter },
        isFilterOpen: true,
      };
    }
    case 'CLOSE_FILTER': {
      return { ...state, isFilterOpen: false };
    }
    case 'SET_FILTER_MODE': {
      return {
        ...state,
        draftFilter: { ...state.draftFilter, mode: action.payload },
      };
    }
    case 'SET_FILTER_MONTH': {
      return {
        ...state,
        draftFilter: { ...state.draftFilter, month: action.payload },
      };
    }
    case 'SET_FILTER_YEAR': {
      return {
        ...state,
        draftFilter: { ...state.draftFilter, year: action.payload },
      };
    }
    case 'APPLY_FILTER': {
      return {
        ...state,
        appliedFilter: { ...state.draftFilter },
        isFilterOpen: false,
      };
    }
    case 'RESET_FILTER': {
      return {
        ...state,
        appliedFilter: initialFilterValues,
        draftFilter: initialFilterValues,
        isFilterOpen: false,
        search: '',
      };
    }
    default: {
      return state;
    }
  }
};

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

const TransactionRow = ({ item }: { item: TransactionItem }) => {
  const metal =
    metalConfig[item.metalType as MetalTypeValue] ??
    metalConfig[MetalType.GOLD];
  return (
    <View className="border-border border-b px-4 py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View
            className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${metal.bgColor}`}
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
            <Text className="text-success text-base font-bold">
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

const TransactionSkeleton = () => (
  <View className="border-border border-b px-4 py-3">
    <View className="flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <View className="ml-2 flex-1">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="mt-1 h-3 w-36 rounded-md" />
        </View>
      </View>
      <View className="items-end">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="mt-1 h-3 w-24 rounded-md" />
      </View>
    </View>
  </View>
);

export default function AllTransactions() {
  const [state, dispatch] = useReducer(pageReducer, initialState);

  // Month is only sent when user explicitly toggles to month_year mode
  const queryMonth =
    state.appliedFilter.mode === FilterMode.YEAR_ONLY
      ? undefined
      : state.appliedFilter.month;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useRecentTransactionInfinite({
    limit: LIMIT,
    month: queryMonth,
    name: state.appliedFilter.name,
    year: state.appliedFilter.year,
  });

  // Deduplicate entries by unique ID for LegendList
  const flatTransactions = useMemo(() => {
    if (!data?.pages) {
      return [];
    }

    const rawList = data.pages.flatMap(
      (page) => (page?.data as TransactionItem[]) ?? []
    );

    const seenIds = new Set<string | number>();
    return rawList.filter((item) => {
      if (!item?.id || seenIds.has(item.id)) {
        return false;
      }
      seenIds.add(item.id);
      return true;
    });
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Active if not in default Year-wise mode for the current year or if searching
  const hasActiveFilters =
    state.appliedFilter.mode !== FilterMode.YEAR_ONLY ||
    state.appliedFilter.name !== '' ||
    state.appliedFilter.year !== CURRENT_YEAR;

  return (
    <Profile.Container scrollable={false}>
      {/* Search & Filter Header */}
      <View className="bg-background px-4 pt-4 pb-2">
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <SearchField>
              <SearchField.Group>
                <SearchField.SearchIcon>
                  <Icon
                    color="accent"
                    icon={Search}
                    size="sm"
                    withWrapper={false}
                  />
                </SearchField.SearchIcon>
                <SearchField.Input
                  className="text-foreground flex-1 border-0 text-sm"
                  onChangeText={(text) =>
                    dispatch({ payload: text, type: 'SET_SEARCH' })
                  }
                  onSubmitEditing={() => dispatch({ type: 'SUBMIT_SEARCH' })}
                  placeholder="Search investor by name"
                  placeholderTextColor="#888"
                  returnKeyType="search"
                  value={state.search}
                />
                {state.search ? (
                  <SearchField.ClearButton
                    onPress={() => dispatch({ type: 'CLEAR_SEARCH' })}
                    variant="ghost"
                  >
                    <Icon
                      color="accent"
                      icon={Cross}
                      size="sm"
                      withWrapper={false}
                    />
                  </SearchField.ClearButton>
                ) : null}
              </SearchField.Group>
            </SearchField>
          </View>
          <PressableFeedback
            className={`bg-surface h-10 w-10 items-center justify-center rounded-xl border ${
              hasActiveFilters ? 'border-accent bg-accent/10' : 'border-border'
            }`}
            onPress={() => dispatch({ type: 'OPEN_FILTER' })}
          >
            <Icon color="accent" icon={Filter} size="sm" withWrapper={false} />
          </PressableFeedback>
        </View>
      </View>

      {/* Main LegendList */}
      {isLoading ? (
        <View className="mt-4 flex-1">
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
          <TransactionSkeleton />
        </View>
      ) : (
        <LegendList
          data={flatTransactions}
          keyExtractor={(item: TransactionItem, index: number) =>
            item?.id ? `tx-${item.id}` : `index-${index}`
          }
          renderItem={({ item }) => (
            <TransactionRow item={item as TransactionItem} />
          )}
          estimatedItemSize={72}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={
            <View className="p-8">
              <Text className="text-foreground/60 text-center text-sm">
                {state.appliedFilter.name
                  ? `No results for "${state.appliedFilter.name}"`
                  : 'No transactions found.'}
              </Text>
            </View>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="items-center justify-center py-4">
                <ActivityIndicator color="#0066FF" size="small" />
              </View>
            ) : null
          }
        />
      )}

      <FilterSheet
        filterMode={state.draftFilter.mode}
        filterMonth={state.draftFilter.month}
        filterName={state.draftFilter.name}
        filterYear={state.draftFilter.year}
        isOpen={state.isFilterOpen}
        onApply={() => dispatch({ type: 'APPLY_FILTER' })}
        onChangeMode={(mode) =>
          dispatch({ payload: mode, type: 'SET_FILTER_MODE' })
        }
        onOpenChange={(open) =>
          dispatch({ type: open ? 'OPEN_FILTER' : 'CLOSE_FILTER' })
        }
        onReset={() => dispatch({ type: 'RESET_FILTER' })}
        onToggleMonth={(m) =>
          dispatch({ payload: m, type: 'SET_FILTER_MONTH' })
        }
        onToggleYear={(y) => dispatch({ payload: y, type: 'SET_FILTER_YEAR' })}
      />
    </Profile.Container>
  );
}
