// oxlint-disable-next-line github/filenames-match-regex
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Button } from 'heroui-native/button';
import { LinkButton } from 'heroui-native/link-button';
import { useToast } from 'heroui-native/toast';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Lock } from '@/components/icons/lock';
import { User } from '@/components/icons/user';
import { ImageBackground } from '@/components/images';
import { Profile } from '@/components/profile';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/use-login';
import type { LoginBodyType } from '@/services/schema/login';
import { loginBodySchemaType } from '@/services/schema/login';
import { setRefreshToken, setToken } from '@/utils/storage';

export default function LoginScreen() {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useLogin();

  const form = useForm<LoginBodyType>({
    mode: 'onTouched',
    resolver: zodResolver(loginBodySchemaType),
  });

  const handleSubmit: SubmitHandler<LoginBodyType> = async (data) => {
    try {
      const response = await mutateAsync(data);

      if (!response.success) {
        toast.show({
          description: response.message,
          label: 'Login Failed',
          variant: 'danger',
        });
      }

      setToken(response.token);
      setRefreshToken(response.refreshToken);

      toast.show({
        label: 'Welcome back!',
        variant: 'success',
      });

      router.replace('/(app)/(protected)');
    } catch (error) {
      console.log('login form error:', error);

      toast.show({
        description:
          error instanceof Error
            ? error.message
            : 'Invalid credentials. Please try again.',
        label: 'Login Failed',
        variant: 'danger',
      });
    }
  };

  return (
    <Profile.Container scrollable={false}>
      <View className="absolute inset-x-0 -top-4 overflow-hidden rounded-b-2xl">
        <ImageBackground
          className="h-90 w-full"
          contentFit="cover"
          contentPosition="center"
          source={require('@/assets/images/chabi-partner-background.png')}
        />
      </View>

      <KeyboardAwareScrollView
        bottomOffset={80}
        contentContainerClassName="mt-70 grow justify-between p-4 gap-y-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-y-4">
          <Input
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            control={form.control}
            disabled={isPending}
            keyboardType="email-address"
            label="Email"
            name="email"
            onSubmitEditing={() => form.setFocus('password')}
            placeholder="Enter Your Email"
            returnKeyType="next"
            rules={{ required: true }}
            startIcon={User}
          />

          <Input
            autoComplete="current-password"
            autoCorrect={false}
            control={form.control}
            disabled={isPending}
            isSecure
            label="Password"
            name="password"
            onSubmitEditing={form.handleSubmit(handleSubmit)}
            placeholder="Enter Your Password"
            returnKeyType="done"
            rules={{ required: true }}
            startIcon={Lock}
          />

          <LinkButton
            className="self-start"
            onPress={() => router.push('/(app)/(auth)/forgetEmail')}
            size="sm"
          >
            <LinkButton.Label className="text-accent">
              Forgot Password?
            </LinkButton.Label>
          </LinkButton>
        </View>

        <View className="gap-y-3">
          <Button
            className="rounded-xl"
            isDisabled={isPending}
            onPress={form.handleSubmit(handleSubmit)}
            size="lg"
            variant="tertiary"
          >
            <Button.Label>Login</Button.Label>
          </Button>

          <Link asChild href="/(app)/(auth)/registration">
            <Button
              className="rounded-xl"
              isDisabled={isPending}
              size="lg"
              variant="outline"
            >
              <Button.Label className="text-foreground">
                Register as Agent
              </Button.Label>
            </Button>
          </Link>
        </View>
      </KeyboardAwareScrollView>
    </Profile.Container>
  );
}
