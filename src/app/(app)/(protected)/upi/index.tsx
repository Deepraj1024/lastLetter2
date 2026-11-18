import { useRouter } from 'expo-router';
import { Button } from 'heroui-native/button';
import { Card } from 'heroui-native/card';
import { Input } from 'heroui-native/input';
import { Skeleton } from 'heroui-native/skeleton';
import { useToast } from 'heroui-native/toast';
import React, { useEffect, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';

import { Icon } from '@/components/icons';
import { WalletMoney } from '@/components/icons/wallet-money';
import { Profile } from '@/components/profile';
import { useUpisList, useUpiUpdate } from '@/hooks/use-upis';

// UPI format validator
const UPI_REGEX = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/u;

export default function Upi() {
  const router = useRouter();
  const { toast } = useToast();

  const [upi, setUpi] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 404 is handled gracefully: if error or no data, upisData is simply undefined
  const { data: upisData, isLoading } = useUpisList();
  const { mutate: updateUpi, isPending } = useUpiUpdate();

  // Safely check if a primary UPI exists
  const primaryUpi = upisData?.data;
  const hasUpi = Boolean(primaryUpi?.upi_id);

  useEffect(() => {
    if (primaryUpi?.upi_id) {
      setUpi(primaryUpi.upi_id);
    }
  }, [primaryUpi?.upi_id]);

  const handleCancelEdit = () => {
    setUpi(primaryUpi?.upi_id ?? '');
    setIsEditing(false);
    Keyboard.dismiss();
  };

  const handleUpdate = () => {
    Keyboard.dismiss();
    const trimmedUpi = upi.trim();

    if (!trimmedUpi) {
      toast.show({
        description: 'Please enter your UPI ID',
        label: 'Required',
        variant: 'danger',
      });
      return;
    }

    if (!UPI_REGEX.test(trimmedUpi)) {
      toast.show({
        description:
          'Please enter a valid UPI format (e.g. mobile@bank or name@okhdfcbank)',
        label: 'Invalid UPI ID',
        variant: 'danger',
      });
      return;
    }

    updateUpi(
      {
        is_primary: true,
        upi_id: trimmedUpi,
      },
      {
        onError: (error) => {
          toast.show({
            description:
              error.message || 'Failed to update UPI ID. Please try again.',
            label: 'Update Failed',
            variant: 'danger',
          });
        },
        onSuccess: () => {
          setIsEditing(false);
          toast.show({
            description: 'Your UPI ID has been updated successfully',
            label: 'UPI Updated',
            variant: 'success',
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Profile.Container title="UPI Settings">
        <View className="flex-1 gap-4 px-4 pt-4">
          <Card className="bg-surface border-border/20 gap-3 rounded-3xl border p-6">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </Card>
        </View>
      </Profile.Container>
    );
  }

  return (
    <Profile.Container title="UPI Settings">
      <View className="flex-1 justify-between px-4 py-4">
        <View className="gap-5">
          {/* Information Card */}
          <Card className="bg-surface border-border/20 rounded-3xl border p-5 shadow-sm">
            <View className="flex-row items-center gap-3">
              <Icon
                icon={WalletMoney}
                color="accent"
                size="sm"
                variants="soft"
              />
              <View className="flex-1">
                <Text className="text-foreground text-sm font-bold">
                  Settlement Account
                </Text>
                <Text className="text-foreground/60 mt-0.5 text-xs leading-relaxed">
                  Your automatic withdrawals and commission payouts will be
                  transferred to this UPI ID.
                </Text>
              </View>
            </View>
          </Card>

          {/* Existing UPI Found */}
          {hasUpi ? (
            <Card className="bg-surface border-border/20 gap-3 rounded-3xl border p-5 shadow-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-foreground/70 text-xs font-bold tracking-wider uppercase">
                  Primary UPI ID
                </Text>
                <View className="bg-success/15 border-success/30 rounded-full border px-2.5 py-0.5">
                  <Text className="text-success text-10px font-bold uppercase">
                    Active
                  </Text>
                </View>
              </View>

              <Input
                autoCapitalize="none"
                autoCorrect={false}
                className={`h-14 rounded-2xl px-4 text-base font-semibold ${
                  isEditing
                    ? 'bg-background border-accent border'
                    : 'bg-foreground/5 border-border/10 text-foreground/80'
                }`}
                editable={isEditing && !isPending}
                keyboardType="email-address"
                onChangeText={setUpi}
                placeholder="example@upi"
                placeholderTextColor="#9ca3af"
                returnKeyType="done"
                onSubmitEditing={handleUpdate}
                value={upi}
              />

              {isEditing && (
                <Text className="text-foreground/70 text-10px px-1">
                  Supported handles: @okhdfcbank, @okaxis, @oksbi, @paytm, @ybl
                </Text>
              )}
            </Card>
          ) : (
            /* 404 / No UPI Empty State */
            <Card className="bg-surface border-border/40 items-center gap-3 rounded-3xl border border-dashed p-8">
              <Icon
                icon={WalletMoney}
                color="foreground"
                size="md"
                variants="soft"
              />
              <View className="items-center">
                <Text className="text-foreground text-base font-bold">
                  No Primary UPI Found
                </Text>
                <Text className="text-foreground/60 mt-1 px-4 text-center text-xs leading-relaxed">
                  You have not set up a primary UPI ID yet. Add one to enable
                  automatic wallet payouts.
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Bottom Actions */}
        <View className="gap-3 pb-4">
          {hasUpi ? (
            isEditing ? (
              <View className="flex-row gap-3">
                <Button
                  className="flex-1 rounded-2xl"
                  isDisabled={isPending}
                  onPress={handleCancelEdit}
                  size="lg"
                  variant="tertiary"
                >
                  <Button.Label className="text-text font-semibold">
                    Cancel
                  </Button.Label>
                </Button>

                <Button
                  className="flex-1 rounded-2xl shadow-sm"
                  isDisabled={
                    !upi.trim() ||
                    isPending ||
                    upi.trim() === primaryUpi?.upi_id
                  }
                  isLoading={isPending}
                  onPress={handleUpdate}
                  size="lg"
                  variant="primary"
                >
                  <Button.Label className="font-bold">
                    {isPending ? 'Updating...' : 'Save'}
                  </Button.Label>
                </Button>
              </View>
            ) : (
              <Button
                className="w-full rounded-2xl"
                onPress={() => setIsEditing(true)}
                size="lg"
                variant="secondary"
              >
                <Button.Label className="text-base font-bold">
                  Edit UPI ID
                </Button.Label>
              </Button>
            )
          ) : (
            <Button
              className="w-full rounded-2xl shadow-sm"
              onPress={() => router.push('/(app)/(protected)/upi/create')}
              size="lg"
              variant="primary"
            >
              <Button.Label className="text-base font-bold">
                Add UPI ID
              </Button.Label>
            </Button>
          )}
        </View>
      </View>
    </Profile.Container>
  );
}
