import { useLocalSearchParams } from 'expo-router';
import { Card } from 'heroui-native/card';
import { Skeleton } from 'heroui-native/skeleton';
import { ScrollView, Text, View } from 'react-native';

import { Profile } from '@/components/profile';
import { useWithdrawlDetail } from '@/hooks/use-withdrawl';

const formatDateTime = (dateStr?: string | null) => {
  if (!dateStr) {
    return '-';
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  if (!value) {
    return null;
  }

  return (
    <View className="flex-row items-start justify-between py-2">
      <Text className="text-foreground/70 text-sm">{label}</Text>

      <Text
        className="text-foreground ml-4 flex-1 text-right text-sm font-medium"
        numberOfLines={2}
      >
        {value || '--'}
      </Text>
    </View>
  );
};

export default function WalletId() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const withdrawalId = Number(id);

  const { data, isLoading } = useWithdrawlDetail(withdrawalId);

  const withdrawal = data?.data;

  const status = withdrawal?.status?.toLowerCase();
  const isCompleted = status === 'completed';
  const isProcessing = status === 'processing';

  if (isLoading) {
    return (
      <Profile.Container title="Withdrawal Details">
        <View className="flex-1 px-4 pt-6">
          <Card className="bg-surface rounded-3xl p-6">
            <View className="items-center">
              <Skeleton className="h-9 w-32 rounded-full" />

              <Skeleton className="mt-8 h-14 w-48 rounded-2xl" />

              <Skeleton className="mt-3 h-5 w-40 rounded-lg" />

              <View className="mt-8 w-full gap-4">
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </View>
            </View>
          </Card>
        </View>
      </Profile.Container>
    );
  }

  if (!withdrawal) {
    return (
      <Profile.Container title="Withdrawal Details">
        <View className="flex-1 items-center justify-center px-4">
          <Card className="bg-surface items-center rounded-3xl p-8">
            <Text className="text-foreground/70 text-base">
              Withdrawal details not found
            </Text>
          </Card>
        </View>
      </Profile.Container>
    );
  }

  return (
    <Profile.Container title="Withdrawal Details">
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center">
          <View
            className={`rounded-full border px-4 py-1.5 ${
              isCompleted
                ? 'border-success bg-success/15'
                : 'border-warning bg-warning/15'
            }`}
          >
            <Text
              className={`text-xs font-bold tracking-wider ${
                isCompleted ? 'text-success' : 'text-warning'
              }`}
            >
              {withdrawal.status?.toUpperCase()}
            </Text>
          </View>

          <Text className="text-foreground mt-6 text-4xl font-black">
            ₹
            {Number(withdrawal.amount).toLocaleString('en-IN', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Text>

          <Text className="text-foreground/0 mt-1.5 text-sm">
            Withdrawal Amount
          </Text>

          {withdrawal.description && (
            <Text className="text-foreground/70 mt-3 px-2 text-center text-sm">
              {withdrawal.description}
            </Text>
          )}
        </View>

        <Card className="bg-surface mt-6 rounded-3xl p-5">
          <Text className="text-foreground/70 mb-1 text-xs font-bold tracking-wider uppercase">
            Payout Details
          </Text>

          <InfoRow
            label="Beneficiary Name"
            value={withdrawal.payoutDestination?.agentName}
          />
          <InfoRow label="UPI ID" value={withdrawal.payoutDestination?.upiId} />
          <InfoRow
            label="Transfer Type"
            value={withdrawal.payoutDestination?.transferType?.replace(
              '_',
              ' '
            )}
          />
        </Card>

        <Card className="bg-surface mt-4 rounded-3xl p-5">
          <Text className="text-foreground/70 mb-1 text-xs font-bold tracking-wider uppercase">
            {isCompleted ? 'Transaction Details' : 'Request Details'}
          </Text>

          <InfoRow label="UTR Number" value={withdrawal.utr} />
          <InfoRow label="Transaction ID" value={withdrawal.transactionId} />

          <View className="bg-border/20 my-2 h-px w-full" />

          <InfoRow
            label="Requested At"
            value={formatDateTime(
              withdrawal.requestedAt ?? withdrawal.createdAt
            )}
          />

          {isCompleted && (
            <InfoRow
              label="Processed At"
              value={formatDateTime(withdrawal.processedAt)}
            />
          )}

          {isProcessing && (
            <InfoRow
              label="Created At"
              value={formatDateTime(withdrawal.createdAt)}
            />
          )}
        </Card>
      </ScrollView>
    </Profile.Container>
  );
}
