import { router } from 'expo-router';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { useToast } from 'heroui-native/toast';
import { useState } from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';

import { Profile } from '@/components/profile';
import { usePanCard } from '@/hooks/use-pancard';
import { getToken } from '@/utils/storage';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export default function PanVerification() {
  const [pan, setPan] = useState('');
  const { mutate: panCardMutation, isPending: isPanCardPending } = usePanCard();
  const { toast } = useToast();
  const token = getToken();
  console.log(token);

  const isValidPan = PAN_REGEX.test(pan);
  const handleVerifyPan = () => {
    console.log({
      panNumber: pan,
    });
    if (!pan) {
      toast.show({
        description: 'Please enter your PAN number',
        label: 'PAN Required',
        variant: 'danger',
      });
      return;
    }

    panCardMutation(
      { panNumber: pan },
      {
        onError: (err) => {
          console.log('PAN ERROR', err);

          toast.show({
            description: err?.message || 'Invalid PAN or try again',
            label: 'Verification Failed',
            variant: 'danger',
          });
        },
        onSuccess: (res) => {
          console.log('PAN VERIFIED', res);

          toast.show({
            description: 'Your PAN has been verified successfully',
            label: 'PAN Verified',
            variant: 'success',
          });

          router.replace('/(app)/(auth)/verification');
        },
      }
    );
  };

  return (
    <Profile.Container scrollable={false}>
      <View className="absolute -top-4 right-0 left-0 overflow-hidden rounded-b-4xl">
        <ImageBackground
          className="h-64 w-full justify-end"
          resizeMode="cover"
          source={require('@/assets/images/background.png')}
        >
          <View className="px-4 pb-6">
            <Text className="text-foreground text-3xl font-bold">
              Verify Your PAN Card
            </Text>
            <Text className="text-foreground/60 mt-2 text-sm">
              To comply with regulatory guidelines, we need to verify your PAN
              card. This is a quick and secure process powered by Digio.
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View className="mt-44 flex-1 px-4">
        <Text className="text-foreground mt-4 mb-2 text-base font-bold">
          Enter your 10 digit PAN number
        </Text>
        <Input
          autoCapitalize="characters"
          className="h-14"
          maxLength={10}
          onChangeText={(text) => setPan(text.toUpperCase().trim())}
          placeholder="ABCDE1234F"
          placeholderTextColor="#9ca3af"
          value={pan}
        />
        {pan.length > 0 && !isValidPan && (
          <Text className="text-danger mt-2 text-sm">
            Enter a valid PAN number (e.g. ABCDE1234F)
          </Text>
        )}
        <Text className="text-foreground/50 mt-2 text-base font-medium">
          Example
        </Text>
        <View className="border-foreground/30 mt-2 h-60 w-full items-center justify-center rounded-xl border-2 border-dashed">
          <Image
            className="h-80 w-80"
            resizeMode="contain"
            source={require('@/assets/images/pancard.png')}
          />
        </View>
      </View>

      <View className="px-4 pb-4">
        <Button
          isDisabled={!isValidPan || isPanCardPending}
          onPress={handleVerifyPan}
          variant="tertiary"
        >
          <Button.Label>
            {isPanCardPending ? 'Verifying...' : 'Verify'}
          </Button.Label>
        </Button>
      </View>
    </Profile.Container>
  );
}
