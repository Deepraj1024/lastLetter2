import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Button } from 'heroui-native/button';
import { PressableFeedback } from 'heroui-native/pressable-feedback';
import { useToast } from 'heroui-native/toast';
import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import type z from 'zod';

import { Lock } from '@/components/icons/lock';
import { Phone } from '@/components/icons/phone';
import { User } from '@/components/icons/user';
import { Profile } from '@/components/profile';
import { Input } from '@/components/ui/input';
import {
  useEmail,
  useMobileNumber,
  useVerifyEmailOtp,
  useVerifyPhoneOtp,
} from '@/hooks/use-email-phone';
import { useRegister } from '@/hooks/use-register';
import { registerBodySchema } from '@/services/schema/register';
import { setRefreshToken, setToken } from '@/utils/storage';

// ─── Validation Helpers ───────────────────────────────────────
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string | number): boolean => {
  const phoneStr = String(phone);
  return phoneStr.length === 10 && /^\d{10}$/u.test(phoneStr);
};

const isValidOtp = (otp: string | number): boolean => {
  const otpStr = String(otp);
  return otpStr.length === 6 && /^\d{6}$/u.test(otpStr);
};

// ─── Otp Button Component ────────────────────────────────────
interface OtpButtonProps {
  isDisabled: boolean;
  isLoading: boolean;
  isVerified: boolean;
  label: string;
  onPress: () => void;
}

const OtpButton = ({
  label,
  isLoading,
  isVerified,
  onPress,
  isDisabled,
}: OtpButtonProps) => {
  // Hide button completely when input is invalid and not yet verified
  if (isDisabled && !isVerified) {
    return null;
  }

  return (
    <PressableFeedback isDisabled={isVerified || isLoading} onPress={onPress}>
      <View
        className={`rounded-2xl px-3 py-1.5 ${
          isVerified
            ? 'border border-green-500 bg-green-50'
            : 'border-accent bg-accent/10 border'
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            isVerified ? 'text-green-600' : 'text-accent'
          }`}
        >
          {isVerified ? '✓ Verified' : isLoading ? `${label}...` : label}
        </Text>
      </View>
    </PressableFeedback>
  );
};

// oxlint-disable-next-line react-doctor/no-giant-component
export default function Registration() {
  const form = useForm({
    defaultValues: {
      confirmPassword: '',
      email: '',
      emailOtp: '',
      fullName: '',
      mobileNumber: '',
      password: '',
      phoneOtp: '',
    },
    mode: 'onChange',
    resolver: zodResolver(registerBodySchema),
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;
  const { toast } = useToast();

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const email = useWatch({ control, name: 'email' });
  const phone = useWatch({ control, name: 'mobileNumber' });
  const emailOtp = useWatch({ control, name: 'emailOtp' });
  const phoneOtp = useWatch({ control, name: 'phoneOtp' });

  // ─── Validation States ─────────────────────────────────────
  const isEmailValid = useMemo(() => !!email && isValidEmail(email), [email]);
  const isPhoneValid = useMemo(() => !!phone && isValidPhone(phone), [phone]);
  const isEmailOtpValid = useMemo(
    () => !!emailOtp && isValidOtp(emailOtp),
    [emailOtp]
  );
  const isPhoneOtpValid = useMemo(
    () => !!phoneOtp && isValidOtp(phoneOtp),
    [phoneOtp]
  );

  const { mutate: sendEmail, isPending: isSendingEmail } = useEmail();
  const { mutate: verifyEmailOtp, isPending: isVerifyingEmail } =
    useVerifyEmailOtp();
  const { mutate: sendPhone, isPending: isSendingPhone } = useMobileNumber();
  const { mutate: verifyPhoneOtp, isPending: isVerifyingPhone } =
    useVerifyPhoneOtp();
  const { mutateAsync: register, isPending: isRegistering } = useRegister();

  // ─── Handlers ───────────────────────────────────────────────
  const handleSendEmailOtp = useCallback(() => {
    if (!email) {
      toast.show('Please enter email address');
      return;
    }
    if (!isValidEmail(email)) {
      toast.show('Please enter a valid email address');
      return;
    }
    sendEmail(
      { email },
      {
        onError: (err) =>
          toast.show({
            description: 'Please check your email and try again',
            label: err?.message || 'Failed to send OTP',
            variant: 'danger',
          }),
        onSuccess: (res) =>
          toast.show({
            description: res?.message || 'Please check your email inbox',
            label: 'OTP Sent',
            variant: 'success',
          }),
      }
    );
  }, [email, sendEmail, toast]);

  const handleVerifyEmailOtp = useCallback(() => {
    if (!email) {
      toast.show('Please enter email address');
      return;
    }
    if (!(emailOtp && isValidOtp(emailOtp))) {
      toast.show('Please enter a valid 6-digit OTP');
      return;
    }
    verifyEmailOtp(
      { email, otp: emailOtp },
      {
        onError: (err) =>
          toast.show({
            description: 'Please check the OTP and try again',
            label: err?.message || 'Invalid OTP',
            variant: 'danger',
          }),
        onSuccess: () => {
          setEmailVerified(true);
          toast.show({
            description: 'You can now proceed with registration',
            label: 'Email Verified',
            variant: 'success',
          });
        },
      }
    );
  }, [email, emailOtp, verifyEmailOtp, toast]);

  const handleSendPhoneOtp = useCallback(() => {
    if (!phone) {
      toast.show('Please enter phone number');
      return;
    }
    if (!isValidPhone(phone)) {
      toast.show('Please enter a valid 10-digit phone number');
      return;
    }
    sendPhone(
      { mobileNumber: String(phone) },
      {
        onError: (err) =>
          toast.show({
            description: 'Please check your phone number and try again',
            label: err?.message || 'Failed to send OTP',
            variant: 'danger',
          }),
        onSuccess: () =>
          toast.show({
            description: 'OTP has been sent to your mobile number.',
            label: 'OTP Sent',
            variant: 'success',
          }),
      }
    );
  }, [phone, sendPhone, toast]);

  const handleVerifyPhoneOtp = useCallback(() => {
    if (!phone) {
      toast.show('Please enter phone number');
      return;
    }
    if (!(phoneOtp && isValidOtp(phoneOtp))) {
      toast.show('Please enter a valid 6-digit OTP');
      return;
    }
    verifyPhoneOtp(
      { mobileNumber: String(phone), otp: phoneOtp },
      {
        onError: (err) =>
          toast.show({
            description: 'Please check the OTP and try again',
            label: err?.message || 'Invalid OTP',
            variant: 'danger',
          }),
        onSuccess: () => {
          setPhoneVerified(true);
          toast.show({
            description: 'You can now proceed with registration',
            label: 'Phone Verified',
            variant: 'success',
          });
        },
      }
    );
  }, [phone, phoneOtp, verifyPhoneOtp, toast]);

  const onSubmit = useCallback(
    (data: z.infer<typeof registerBodySchema>) => {
      if (!emailVerified) {
        toast.show('Please verify your email first');
        return;
      }
      if (!phoneVerified) {
        toast.show('Please verify your phone number first');
        return;
      }

      register(data, {
        onError: (err) =>
          toast.show({
            description: err?.message || 'Please try again later',
            label: 'Registration Failed',
            variant: 'danger',
          }),
        onSuccess: (res) => {
          const token = res?.token;
          if (token) {
            setToken(token);
          }
          if (res?.refreshToken) {
            setRefreshToken(res.refreshToken);
          }
          toast.show({
            description: "Welcome! Let's set up your profile",
            label: 'Registered Successfully',
            variant: 'success',
          });
          router.replace('/(app)/(auth)/onBoarding');
        },
      });
    },
    [emailVerified, phoneVerified, register, toast]
  );

  const EmailSendButton = useMemo(
    () => (
      <OtpButton
        isDisabled={!isEmailValid}
        isLoading={isSendingEmail}
        isVerified={emailVerified}
        label="Send"
        onPress={handleSendEmailOtp}
      />
    ),
    [isEmailValid, isSendingEmail, emailVerified, handleSendEmailOtp]
  );

  const EmailVerifyButton = useMemo(
    () => (
      <OtpButton
        isDisabled={!(isEmailValid && isEmailOtpValid)}
        isLoading={isVerifyingEmail}
        isVerified={emailVerified}
        label="Verify"
        onPress={handleVerifyEmailOtp}
      />
    ),
    [
      isEmailValid,
      isEmailOtpValid,
      isVerifyingEmail,
      emailVerified,
      handleVerifyEmailOtp,
    ]
  );

  const PhoneSendButton = useMemo(
    () => (
      <OtpButton
        isDisabled={!isPhoneValid}
        isLoading={isSendingPhone}
        isVerified={phoneVerified}
        label="Send"
        onPress={handleSendPhoneOtp}
      />
    ),
    [isPhoneValid, isSendingPhone, phoneVerified, handleSendPhoneOtp]
  );

  const PhoneVerifyButton = useMemo(
    () => (
      <OtpButton
        isDisabled={!(isPhoneValid && isPhoneOtpValid)}
        isLoading={isVerifyingPhone}
        isVerified={phoneVerified}
        label="Verify"
        onPress={handleVerifyPhoneOtp}
      />
    ),
    [
      isPhoneValid,
      isPhoneOtpValid,
      isVerifyingPhone,
      phoneVerified,
      handleVerifyPhoneOtp,
    ]
  );

  // ─── Label Style ────────────────────────────────────────────
  const labelClassName = 'mb-2 font-bold text-foreground/60 text-lg';

  return (
    <Profile.Container scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={20}
      >
        {/* Header */}
        <View className="absolute -top-28 left-0 overflow-hidden rounded-b-4xl">
          <ImageBackground
            className="h-44 w-full justify-end"
            resizeMode="cover"
            source={require('@/assets/images/background.png')}
          >
            <View className="pointer-events-none px-4 pb-6">
              <Text className="text-foreground text-3xl font-bold">
                Enter Details
              </Text>
              <Text className="text-foreground/80 mt-2 text-sm">
                Complete your profile by entering some basic details about
                yourself
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Form */}
        <ScrollView
          className="mt-20 px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Full Name */}
          <Input
            control={control}
            label="Your Name"
            labelClassName={labelClassName}
            name="fullName"
            onSubmitEditing={() => form.setFocus('email')}
            placeholder="Eg : Ravi Gupta"
            returnKeyType="next"
            rules={{ required: 'Name is required' }}
            startIcon={User}
          />

          <View className="bg-foreground/10 mt-4 mb-4 h-0.5 w-full" />
          <View className="gap-4">
            {/* Email */}
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              control={control}
              endComponent={() => EmailSendButton}
              keyboardType="email-address"
              label="Your Email"
              labelClassName={labelClassName}
              name="email"
              placeholder="Enter your email"
              returnKeyType="next"
              rules={{
                pattern: {
                  message: 'Please enter a valid email',
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/u,
                },
                required: 'Email is required',
              }}
              startIcon={User}
            />

            {/* Email OTP */}
            <Input
              control={control}
              endComponent={() => EmailVerifyButton}
              keyboardType="number-pad"
              label="Enter OTP (Email)"
              labelClassName={labelClassName}
              maxLength={6}
              name="emailOtp"
              onSubmitEditing={() => form.setFocus('mobileNumber')}
              placeholder="Enter 6-digit OTP"
              returnKeyType="next"
              rules={{
                pattern: {
                  message: 'OTP must be 6 digits',
                  value: /^\d{6}$/u,
                },
                required: 'Email OTP is required',
              }}
            />

            {/* Phone */}
            <Input
              control={control}
              endComponent={() => PhoneSendButton}
              keyboardType="number-pad"
              label="Your Phone"
              labelClassName={labelClassName}
              maxLength={10}
              name="mobileNumber"
              placeholder="Enter 10-digit number"
              returnKeyType="next"
              rules={{
                pattern: {
                  message: 'Phone must be 10 digits',
                  value: /^\d{10}$/u,
                },
                required: 'Phone number is required',
              }}
              startIcon={Phone}
            />

            {/* Phone OTP */}
            <Input
              control={control}
              endComponent={() => PhoneVerifyButton}
              keyboardType="number-pad"
              label="Enter OTP (Phone)"
              labelClassName={labelClassName}
              maxLength={6}
              name="phoneOtp"
              onSubmitEditing={() => form.setFocus('password')}
              placeholder="Enter 6-digit OTP"
              returnKeyType="next"
              rules={{
                pattern: {
                  message: 'OTP must be 6 digits',
                  value: /^\d{6}$/u,
                },
                required: 'Phone OTP is required',
              }}
            />

            {/* Password */}
            <Input
              autoComplete="new-password"
              control={control}
              isSecure
              label="Enter Password"
              labelClassName={labelClassName}
              name="password"
              placeholder="Enter password"
              returnKeyType="next"
              rules={{ required: 'Password is required' }}
              startIcon={Lock}
            />

            {/* Confirm Password */}
            <Input
              autoComplete="new-password"
              control={control}
              isSecure
              label="Re-enter Password"
              labelClassName={labelClassName}
              name="confirmPassword"
              onSubmitEditing={handleSubmit(onSubmit)}
              placeholder="Re-enter password"
              returnKeyType="done"
              rules={{
                required: 'Please confirm password',
                validate: (value) =>
                  value === form.getValues('password') ||
                  'Passwords do not match',
              }}
              startIcon={Lock}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <Animated.View className="px-3 py-3">
        <Button
          isDisabled={!(isValid && emailVerified && phoneVerified)}
          onPress={handleSubmit(onSubmit)}
          variant="secondary"
        >
          <Button.Label className="text-lg font-bold">
            {isRegistering ? 'Submitting...' : 'Submit'}
          </Button.Label>
        </Button>
      </Animated.View>
    </Profile.Container>
  );
}
