import { router } from 'expo-router';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { useToast } from 'heroui-native/toast';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Profile } from '@/components/profile';
import { useUpis } from '@/hooks/use-upis';

export default function Upi() {
  const [upi, setUpi] = useState('');
  const { mutate: upisMutate, isPending } = useUpis();
  const { toast } = useToast();
  const isButtonDisabled = !upi.trim() || isPending;

  const handleSave = () => {
    if (!upi.trim()) {
      toast.show({
        description: 'Please enter a valid UPI ID',
        label: 'Invalid UPI',
        variant: 'danger',
      });
      return;
    }

    upisMutate(
      {
        is_primary: true,
        upi_id: upi.trim(),
      },
      {
        onError: (error) => {
          toast.show({
            description: error.message,
            label: 'Update Failed',
            variant: 'danger',
          });
        },

        onSuccess: () => {
          toast.show({
            description: 'Your UPI ID has been saved successfully',
            label: 'UPI Saved',
            variant: 'success',
          });

          if (router.canGoBack()) {
            router.back();
          }
        },
      }
    );
  };
  return (
    <Profile.Container title="UPI">
      <View className="mt-2 flex-1 justify-between p-4">
        <View>
          <Text className="text-foreground mb-2 text-lg font-semibold">
            Enter your UPI ID
          </Text>

          <Input
            autoCapitalize="none"
            className="h-16"
            onChangeText={setUpi}
            placeholder="example@upi"
            placeholderTextColor="#9ca3af"
            value={upi}
          />
        </View>

        <Button
          isDisabled={isButtonDisabled}
          onPress={handleSave}
          variant="secondary"
        >
          <Button.Label className="text-base font-bold">
            {isPending ? 'Saving...' : 'Save UPI ID'}
          </Button.Label>
        </Button>
      </View>
    </Profile.Container>
  );
}
