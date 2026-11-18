// check-spell:ignore digio aadhaar digiotech aadhar
import { Digio, Environment, ServiceMode } from '@digiotech/react-native';
import type {
  DigioConfig,
  DigioResponse,
  GatewayEvent,
} from '@digiotech/react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { useToast } from 'heroui-native/toast';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import type z from 'zod';

import { ImageBackground } from '@/components/images';
import { Profile } from '@/components/profile';
import { useAadhar } from '@/hooks/use-aadhar';
import { useProfile } from '@/hooks/use-profile';
import { registerBodySchema } from '@/services/schema/register';

const formSchema = registerBodySchema.omit({ email: true, password: true });
type Form = z.infer<typeof formSchema>;

const DIGIO_CONFIG: DigioConfig = {
  environment: Environment.PRODUCTION,
  logo: '',
  serviceMode: ServiceMode.OTP,
  theme: {
    fontFamily: '',
    fontFormat: '',
    fontUrl: '',
    primaryColor: '#b03a2e',
    secondaryColor: '#b03a2e',
  },
};

export default function AadharVerification() {
  const { toast } = useToast();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { mutateAsync: aadharMutate } = useAadhar();

  const digioRef = useRef<Digio | null>(null);
  const hasNavigatedRef = useRef(false);
  const mobileInputRef = useRef<React.ComponentRef<typeof Input>>(null);

  const form = useForm<Form>({
    defaultValues: {
      fullName: profileData?.agent.fullName ?? '',
      mobileNumber: profileData?.agent.mobileNumber ?? '',
    },
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const digio = new Digio(DIGIO_CONFIG);
    digioRef.current = digio;

    const listener = digio.addGatewayEventListener((event: GatewayEvent) => {
      console.log('Digio Event:', event);
    });

    return () => {
      listener.remove();
      digioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isProfileLoading && profileData?.agent.fullName) {
      form.setValue('fullName', profileData.agent.fullName);
      form.setValue('mobileNumber', profileData.agent.mobileNumber);
    }
  }, [
    isProfileLoading,
    profileData?.agent.fullName,
    profileData?.agent.mobileNumber,
    form.setValue,
  ]);

  const startDigio = async (
    documentId: string,
    identifier: string,
    gatewayToken: string
  ): Promise<void> => {
    if (!digioRef.current) {
      toast.show({
        description:
          'Verification SDK failed to initialize. Please restart the app.',
        label: 'SDK Not Ready',
        variant: 'danger',
      });
      return;
    }

    try {
      const response: DigioResponse = await digioRef.current.start(
        documentId,
        identifier,
        gatewayToken
      );

      if (response?.message === 'KYC process completed') {
        if (hasNavigatedRef.current) {
          return;
        }
        hasNavigatedRef.current = true;

        router.replace({
          params: { kid: documentId },
          pathname: '/(app)/(auth)/verification',
        });
      }
    } catch (error) {
      console.log('Digio Error:', error);
      toast.show({
        description:
          error instanceof Error
            ? error.message
            : 'Verification could not be completed. Please try again.',
        label: 'Verification Failed',
        variant: 'danger',
      });
    }
  };

  const handleVerify = form.handleSubmit(async (values: Form) => {
    const { fullName, mobileNumber } = values;

    toast.show({
      description: 'Starting Aadhaar verification…',
      label: 'Processing',
      variant: 'default',
    });

    try {
      const response = await aadharMutate({
        name: fullName,
        phone: mobileNumber,
      });

      const kid = response?.kid_request_id;
      const gatewayToken = response?.access_token;

      if (kid && gatewayToken) {
        await startDigio(kid, mobileNumber, gatewayToken);
      } else {
        toast.show({
          description:
            'Unable to start Aadhaar verification. Please try again.',
          label: 'Verification Failed',
          variant: 'danger',
        });
      }
    } catch (error) {
      console.log('Aadhaar Error:', error);
      toast.show({
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
        label: 'Verification Failed',
        variant: 'danger',
      });
    }
  });

  return (
    <Profile.Container scrollable={false}>
      <View className="absolute inset-x-0 -top-4 right-0 left-0 overflow-hidden rounded-b-4xl">
        <ImageBackground
          className="h-64 w-full justify-end"
          contentFit="cover"
          contentPosition="center"
          source={require('@/assets/images/background.png')}
        >
          <View className="px-4 pb-6">
            <Text className="text-foreground text-3xl font-bold">
              Verify Your Aadhaar Card
            </Text>
            <Text className="text-foreground/80 mt-2 text-sm leading-relaxed">
              To comply with regulatory guidelines, we need to verify your
              identity. This is a quick and secure process powered by Digio.
            </Text>
          </View>
        </ImageBackground>
      </View>
      <KeyboardAwareScrollView
        bottomOffset={80}
        contentContainerClassName="pb-6 grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-44 flex-1 gap-y-4 px-4">
          <View className="gap-y-2">
            <Text className="text-foreground text-base font-bold">
              Name as per Aadhaar Card
            </Text>

            <Controller
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <>
                  <Input
                    autoCapitalize="words"
                    autoCorrect={false}
                    className="h-14"
                    isDisabled={isSubmitting}
                    isInvalid={!!fieldState.error}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    onSubmitEditing={() => mobileInputRef.current?.focus()}
                    placeholder="Enter your name"
                    ref={field.ref}
                    returnKeyType="next"
                    textContentType="name"
                    value={field.value}
                  />
                </>
              )}
            />
          </View>

          <View className="gap-y-2">
            <Text className="text-foreground text-base font-bold">
              Mobile Number Linked to Aadhaar
            </Text>

            <Controller
              control={form.control}
              name="mobileNumber"
              render={({ field, fieldState }) => (
                <Input
                  className="h-14"
                  isDisabled={isSubmitting}
                  isInvalid={!!fieldState.error}
                  keyboardType="number-pad"
                  maxLength={10}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  onSubmitEditing={handleVerify}
                  placeholder="Enter mobile number"
                  ref={(r) => {
                    field.ref(r);
                    mobileInputRef.current = r;
                  }}
                  returnKeyType="done"
                  textContentType="telephoneNumber"
                  value={field.value}
                />
              )}
            />
          </View>

          <View className="border-foreground/20 bg-surface/50 h-60 w-full items-center justify-center rounded-2xl border-2 border-dashed">
            <Image
              className="h-48 w-full"
              resizeMode="contain"
              source={require('@/assets/images/aadhar.png')}
            />
            <Text className="text-foreground/40 mt-2 text-xs tracking-wide">
              Sample Aadhaar Card
            </Text>
          </View>
        </View>

        <View className="mt-6 px-4">
          <Button
            className="rounded-2xl"
            isDisabled={isSubmitting || hasNavigatedRef.current}
            // isLoading={isSubmitting}
            onPress={handleVerify}
            variant="tertiary"
          >
            <Button.Label>
              {hasNavigatedRef.current ? '✓ Verified' : 'Verify Aadhaar'}
            </Button.Label>
          </Button>

          <Text className="text-foreground/40 mt-3 text-center text-xs">
            Your data is encrypted and never stored on our servers.
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </Profile.Container>
  );
}
