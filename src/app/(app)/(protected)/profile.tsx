import { router } from 'expo-router';
import { Button } from 'heroui-native/button';
import { Dialog } from 'heroui-native/dialog';
import { PressableFeedback } from 'heroui-native/pressable-feedback';
import { useToast } from 'heroui-native/toast';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { Image, Text, View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import { Icon } from '@/components/icons';
import { Building } from '@/components/icons/building';
import { Edit } from '@/components/icons/edit';
import { Eye } from '@/components/icons/eye';
import { Info } from '@/components/icons/info';
import { Logout } from '@/components/icons/logout';
import { Phone } from '@/components/icons/phone';
import { Trash } from '@/components/icons/trash';
import { User } from '@/components/icons/user';
import { UserOutline } from '@/components/icons/user-outline';
import { UserPlus } from '@/components/icons/user-plus';
import { WalletMoney } from '@/components/icons/wallet-money';
import { Profile } from '@/components/profile';
import { useCalcutaion } from '@/hooks/use-calculator';
import { useDeleteAccount } from '@/hooks/use-delete';
import { useLogout } from '@/hooks/use-login';
import { useProfile } from '@/hooks/use-profile';
import { queryClient } from '@/utils/query';
import { clearSession } from '@/utils/storage';

const InfoCard = ({
  icon,
  text,
  rightIcon,
}: {
  icon?: FC<SvgProps>;
  text: string;
  rightIcon?: React.ComponentType;
}) => (
  <View className="bg-surface flex-row items-center justify-between rounded-xl px-4 py-3">
    <View className="flex-1 flex-row items-center gap-3">
      {icon && (
        <Icon color="background" icon={icon} size="md" withWrapper={false} />
      )}

      <Text
        className="text-foreground flex-1 text-base font-medium"
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>

    {rightIcon && (
      <PressableFeedback
        onPress={() => router.push('/(app)/(protected)/address')}
      >
        <Icon
          color="background"
          icon={rightIcon as FC<SvgProps>}
          size="md"
          withWrapper={false}
        />
      </PressableFeedback>
    )}
  </View>
);

// oxlint-disable-next-line complexity
export default function UserProfile() {
  const { data } = useProfile();
  const { toast } = useToast();
  const { mutateAsync: logoutAccount } = useLogout();
  const { mutateAsync: deleteAccount } = useDeleteAccount();
  const { data: calculationData } = useCalcutaion();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const year1Earnings = calculationData?.data.year1Earnings || 0;
  const year2Earnings = calculationData?.data.year2Earnings || 0;
  const year3Earnings = calculationData?.data.year3Earnings || 0;

  const logout = async () => {
    try {
      await logoutAccount();

      await clearSession();
      queryClient.clear();

      toast.show({
        description: 'You have been logged out successfully',
        label: 'Logged out successfully',
        variant: 'success',
      });

      router.replace('/(app)/(auth)/loginScreen');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const handleLogout = () => {
    setIsLogoutDialogOpen(false);

    setTimeout(() => {
      logout();
    }, 200);
  };
  const confirmDeleteAccount = useCallback(async () => {
    try {
      // oxlint-disable-next-line promise/avoid-new
      await new Promise<void>((resolve, reject) => {
        deleteAccount(undefined, {
          onError: (error) => {
            toast.show({
              description:
                error?.message || 'Unable to delete account. Please try again.',
              label: 'Delete Failed',
              variant: 'danger',
            });

            reject(error);
          },
          onSuccess: async () => {
            try {
              await clearSession();
              await queryClient.clear();

              queryClient.invalidateQueries();

              toast.show({
                description: 'Your account has been deleted successfully.',
                label: 'Account Deleted',
                variant: 'success',
              });

              resolve();
            } catch (error) {
              reject(error);
            }
          },
        });
      });
      router.replace('/(app)/(auth)/loginScreen');
    } catch (error) {
      console.log('Delete account error:', error);
    }
  }, [deleteAccount, toast]);

  return (
    <Profile.Container>
      <View className="pt-safe-offset-0 px-4">
        <Image
          className="size-24 rounded-xl"
          resizeMode="cover"
          source={require('@/assets/images/agent.png')}
        />

        <Text className="text-foreground mt-2 text-3xl font-extrabold capitalize">
          Hi, {data?.agent?.fullName || 'User'}
        </Text>

        <View className="mt-2 flex-row gap-2">
          <View className="bg-accent rounded-md px-2 py-1">
            <Text className="text-text text-xs">Chabi Partner</Text>
          </View>

          <View className="border-border bg-background rounded-md border px-2 py-1">
            <Text className="text-accent text-xs">
              ID : {data?.agent?.refferalCode}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-border my-4 h-px" />

      <View className="px-4">
        <Text className="text-accent mb-3 text-base font-bold">
          Earning Breakdown
        </Text>

        <View className="bg-surface overflow-hidden rounded-xl">
          {[
            { label: 'Year 1', value: `${year1Earnings}% (New)` },
            {
              label: 'Year 2',
              value: `(${year1Earnings}% + ${year2Earnings}% Trail)`,
            },
            {
              label: 'Year 3',
              value: `(${year1Earnings}% + ${year2Earnings}% + ${year3Earnings}%)`,
            },
            {
              label: 'Year 4+',
              value: `(${year1Earnings}% + ${year2Earnings}% + ${year3Earnings}% All Trail)`,
            },
          ].map((item, index) => (
            <View
              className={`flex-row items-center justify-between px-4 py-3 ${
                index === 3 ? '' : 'border-foreground/10 border-b'
              }`}
              key={item.label}
            >
              <Text className="text-accent text-base">{item.label}</Text>

              <Text className="text-foreground text-md text-right font-semibold">
                {item.value}
              </Text>
            </View>
          ))}

          <View className="bg-foreground/10 px-4 py-3">
            <Text className="text-foreground/80 text-xs">
              * Cumulative trailing earnings based on client retention.
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5 px-4">
        <Text className="text-accent mb-2 text-sm font-semibold tracking-widest">
          BASIC DETAILS
        </Text>

        <View className="gap-3">
          <InfoCard icon={User} text={data?.agent?.fullName || 'User'} />
          <InfoCard icon={Phone} text={data?.agent?.mobileNumber || ''} />
          <InfoCard icon={UserPlus} text={data?.agent?.email || ''} />
          <InfoCard
            icon={User}
            rightIcon={Edit}
            text={data?.agent?.address || 'Enter address'}
          />
        </View>
      </View>

      <View className="mt-5 px-4">
        <Text className="text-accent mb-2 text-sm font-semibold">PAYMENTS</Text>

        <View className="gap-3">
          <Profile.Tile
            href="/(app)/(protected)/wallet"
            icon={<WalletMoney className="text-accent" />}
            title="Wallet"
          />
          <Profile.Tile
            href="/(app)/(protected)/upi"
            icon={<Building className="text-accent" />}
            title="UPI"
          />
        </View>
      </View>

      <View className="mt-5 mb-3 gap-3 px-4">
        <Text className="text-accent text-sm font-semibold">ACCOUNT</Text>
        <Profile.Tile
          icon={<Info className="text-accent" />}
          href="/(app)/(protected)/about"
          title="About App"
        />
        <Profile.Tile
          icon={<Logout className="text-accent" />}
          onPress={() => setIsLogoutDialogOpen(true)}
          title="Logout"
        />

        <Profile.Tile
          icon={<Trash className="text-danger" />}
          onPress={() => setIsDeleteDialogOpen(true)}
          title="Delete Account"
        />
      </View>
      <Dialog isOpen={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60" />
          <Dialog.Content className="border-border bg-surface border">
            <View className="mb-5 gap-1.5">
              <View className="flex flex-row items-center justify-between">
                <Dialog.Title>Delete Account</Dialog.Title>

                <Dialog.Close variant="outline" />
              </View>
              <Dialog.Description className="text-default-soft-hover">
                Are you sure you want to delete your account? This action is
                permanent. All your personal data, account information, referral
                records, and earned earning will be permanently deleted and
                cannot be recovered.
              </Dialog.Description>
            </View>
            <View className="flex-row justify-end gap-3">
              <Button
                onPress={() => setIsDeleteDialogOpen(false)}
                size="sm"
                variant="ghost"
              >
                <Button.Label className="text-default-soft-hover">
                  Cancel
                </Button.Label>
              </Button>
              <Button
                className="rounded-2xl"
                onPress={confirmDeleteAccount}
                size="sm"
                variant="danger"
              >
                Delete Account
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      <Dialog isOpen={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60" />

          <Dialog.Content className="border-border bg-surface border">
            <View className="mb-5 gap-1.5">
              <View className="flex-row items-center justify-between">
                <Dialog.Title>Logout</Dialog.Title>

                <Dialog.Close variant="outline" />
              </View>

              <Dialog.Description className="text-default-soft-hover">
                Are you sure you want to logout from your account?
              </Dialog.Description>
            </View>

            <View className="flex-row justify-end gap-3">
              <Button
                onPress={() => setIsLogoutDialogOpen(false)}
                size="sm"
                variant="ghost"
              >
                <Button.Label className="text-default-soft-hover">
                  Cancel
                </Button.Label>
              </Button>

              <Button
                className="rounded-2xl"
                onPress={handleLogout}
                size="sm"
                variant="danger"
              >
                Logout
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </Profile.Container>
  );
}
