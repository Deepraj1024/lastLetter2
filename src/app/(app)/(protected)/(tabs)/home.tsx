// oxlint-disable no-nested-ternary sonarjs/no-wildcard-import
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { BottomSheet } from 'heroui-native/bottom-sheet';
import { Button } from 'heroui-native/button';
import { Card } from 'heroui-native/card';
import { Dialog } from 'heroui-native/dialog';
import { PressableFeedback } from 'heroui-native/pressable-feedback';
import { Skeleton } from 'heroui-native/skeleton';
import { useToast } from 'heroui-native/toast';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import QRCodeStyled from 'react-native-qrcode-styled';
import Share, { Social } from 'react-native-share';
import type { ShareSingleOptions } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import { Container } from '@/components/container';
import { Icon } from '@/components/icons';
import { AltArrowRight } from '@/components/icons/alt-arrow-right';
import { Copy } from '@/components/icons/copy';
import { HandMoney } from '@/components/icons/hand-money';
import { PiggyBank } from '@/components/icons/piggy-bank';
import { Send } from '@/components/icons/send';
import { UserPlus } from '@/components/icons/user-plus';
import PartnerHeader from '@/components/profile-header';
import { useChottuLink } from '@/hooks/use-chottu-link';
import { useProfile } from '@/hooks/use-profile';
import { useReferral } from '@/hooks/use-referral';

// oxlint-disable-next-line complexity react-doctor/no-giant-component
export default function Home() {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReferralSheetOpen, setIsReferralSheetOpen] = useState(false);

  const qrRef = useRef<typeof ViewShot>(null);
  const {
    data: chottuLinkData,
    isPending: isChottuLinkPending,
    error: chottuLinkError,
  } = useChottuLink();

  const {
    data: referralData,
    isLoading: isReferralLoading,
    refetch,
  } = useReferral();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();

  const profileName = profileData?.agent.fullName;
  const id = profileData?.agent.refferalCode;
  const { toast } = useToast();
  const referral = referralData?.data.currentMonthData;
  const comparison =
    referralData?.data?.currentMonthData.comparisonWithLastMonth;
  const trendText =
    comparison?.status === 'up'
      ? `+${comparison?.percentageChange}% from last month`
      : // oxlint-disable-next-line sonarjs/no-nested-conditional
        comparison?.percentageChange === 0
        ? `0% from last month`
        : `-${comparison?.percentageChange}% from last month`;

  const handleCopy = async () => {
    if (!chottuLinkData?.shortURL) {
      return;
    }

    await Clipboard.setStringAsync(chottuLinkData?.shortURL);
  };

  const handleSharePress = async () => {
    try {
      const imageUri = await qrRef.current?.capture();

      if (!imageUri) {
        return;
      }

      setIsShareOpen(() => false);
      setIsReferralSheetOpen(() => false);

      await Share.open({
        message: `Hi Friend! 👋
I've been using Chabi for a while now, and it's been a safe, secure, and rewarding experience. That's why I feel confident recommending it to my friends and family.
Here's why I think you'll like it too:
✨ With Chabi, you can:
✅ Start your investment journey with Digital Gold & Digital Silver from just ₹10
✅ Invest in best-in-class Fixed Deposits and earn up to 8.25% annual returns
✅ Build wealth consistently through Digital Gold SIP
✅ Withdraw your Digital Gold anytime whenever you need funds
✅ Fixed Deposits come with deposit insurance of up to ₹5 lakh under DICGC
✅ Access bite-sized financial learning to make smarter money decisions
✅ Enjoy a simple, trusted, and secure investment experience
🎁 Join Chabi today using my exclusive invitation link and discover a smarter way to Learn. Invest. Grow.
${chottuLinkData?.shortURL}
⏳ This invitation link is valid for the next 24 hours only.
Take the first step towards financial learning, smarter investing, and long-term financial growth with Chabi. 🚀.`,
        title: 'Share via',
        url: imageUri,
      });
    } catch (error) {
      console.log('error in share:', error);
    }
  };

  return (
    <Container
      refreshControl={
        <RefreshControl
          onRefresh={refetch}
          refreshing={false}
          colors={['#0066FF']}
        />
      }
    >
      <View className="px-safe-offset-3">
        {isProfileLoading ? (
          <View className="flex-row items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <View className="gap-2">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-5 w-32 rounded-lg" />
            </View>
          </View>
        ) : (
          <PartnerHeader name={profileName || 'USER'} partnerId={id || ' '} />
        )}
        <View className="mt-8">
          <ImageBackground
            className="h-44 w-full overflow-hidden rounded-2xl"
            source={require('@/assets/images/qr-background.png')}
          >
            <View className="w-full flex-1 flex-row items-center justify-between px-4">
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-foreground flex-1 text-2xl font-bold">
                    Invite Your Investors
                  </Text>

                  {chottuLinkData?.shortURL ? (
                    <QRCodeStyled
                      color="#0B3C91"
                      data={chottuLinkData?.shortURL}
                      innerEyesOptions={{ borderRadius: 2 }}
                      outerEyesOptions={{ borderRadius: 5 }}
                      padding={5}
                      pieceCornerType="rounded"
                      pieceScale={1.03}
                      size={35}
                      style={{ backgroundColor: '#fff', borderRadius: 10 }}
                    />
                  ) : (
                    <View className="bg-foreground h-9 w-9 items-center justify-center rounded-lg">
                      <ActivityIndicator />
                    </View>
                  )}
                </View>

                <Text className="text-foreground text-md my-1 w-[70%]">
                  Share your unique link or show your QR code to invite
                  investors
                </Text>

                <View className="mt-3 flex-row gap-2">
                  <PressableFeedback
                    className="bg-foreground rounded-lg px-5 py-3"
                    onPress={() => setIsReferralSheetOpen(true)}
                  >
                    <Text className="text-md text-text font-medium">
                      View Full QR
                    </Text>
                  </PressableFeedback>

                  <View>
                    <PressableFeedback
                      className="border-foreground rounded-lg border px-5 py-3"
                      onPress={() => setIsShareOpen(true)}
                    >
                      <Text className="text-foreground text-md font-medium">
                        Share Link
                      </Text>
                    </PressableFeedback>
                    <BottomSheet
                      isOpen={isReferralSheetOpen}
                      onOpenChange={setIsReferralSheetOpen}
                    >
                      <BottomSheet.Portal>
                        <BottomSheet.Overlay className="bg-black/80" />

                        <BottomSheet.Content backgroundClassName="bg-background">
                          <View className="items-center gap-5 px-2 pb-6">
                            <BottomSheet.Title className="text-foreground text-center text-lg font-bold">
                              My QR Code
                            </BottomSheet.Title>
                            {chottuLinkData?.shortURL ? (
                              <ViewShot
                                options={{ format: 'png', quality: 1 }}
                                ref={qrRef}
                              >
                                <QRCodeStyled
                                  color="#0B3C91"
                                  data={chottuLinkData?.shortURL}
                                  innerEyesOptions={{ borderRadius: 10 }}
                                  isPiecesGlued={true}
                                  outerEyesOptions={{ borderRadius: 25 }}
                                  padding={16}
                                  pieceBorderRadius={2}
                                  pieceCornerType="rounded"
                                  pieceScale={0.9}
                                  size={200}
                                  style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: 20,
                                  }}
                                />
                              </ViewShot>
                            ) : (
                              <Text className="text-foreground">
                                Generating QR...
                              </Text>
                            )}
                            <Text className="text-warning text-base">
                              This referral link is valid for 12-15 hours
                            </Text>
                            <View className="border-border bg-surface w-full rounded-2xl border px-4 py-3">
                              <Text className="text-accent/60 text-xs">
                                Your Referral Link
                              </Text>
                              <View className="mt-1 flex-row items-center justify-between">
                                <Text
                                  className="text-foreground flex-1 text-base font-semibold"
                                  numberOfLines={1}
                                >
                                  {chottuLinkData?.shortURL}
                                </Text>

                                <PressableFeedback
                                  className="bg-accent ml-2 rounded-xl px-2 py-2"
                                  onPress={handleCopy}
                                >
                                  <Icon
                                    color="background"
                                    icon={Copy}
                                    variants="soft"
                                    withWrapper={false}
                                  />
                                </PressableFeedback>
                              </View>
                            </View>
                            <View className="flex flex-row items-center justify-between gap-x-4">
                              <Button
                                className="flex flex-1 rounded-2xl"
                                isDisabled={
                                  isChottuLinkPending || !!chottuLinkError
                                }
                                onPress={handleSharePress}
                                size="lg"
                                variant="tertiary"
                              >
                                <Icon
                                  icon={Send}
                                  size="lg"
                                  variants="solid"
                                  withWrapper={false}
                                />
                                <Button.Label className="text-text text-base font-extrabold">
                                  Share
                                </Button.Label>
                              </Button>

                              {/*<Button
                                className="rounded-2xl"
                                isDisabled={
                                  isChottuLinkPending || !!chottuLinkError
                                }
                                isIconOnly
                                onPress={handleSharePress}
                                size="lg"
                                variant="tertiary"
                              >
                                <Icon icon={Link} withWrapper={false} />
                              </Button>*/}
                            </View>
                          </View>
                        </BottomSheet.Content>
                      </BottomSheet.Portal>
                    </BottomSheet>

                    <Dialog isOpen={isShareOpen} onOpenChange={setIsShareOpen}>
                      <Dialog.Portal>
                        <Dialog.Overlay className="flex-1 items-center justify-center bg-black/80">
                          <Dialog.Content className="bg-background items-center justify-center overflow-hidden rounded-3xl p-5 py-5">
                            <Icon
                              icon={HandMoney}
                              size="lg"
                              variants="transparent"
                            />
                            <Text className="text-foreground text-center text-xl font-bold">
                              Don’t Miss Your First Earnings
                            </Text>

                            <Text className="text-foreground/80 mt-2 text-center text-sm leading-5">
                              Invite investors using your QR or link and earn on
                              every investment.
                            </Text>

                            <View className="mt-6 w-full items-center">
                              <View className="w-full flex-row justify-between px-2">
                                <Text className="text-foreground/80 w-1/3 text-center text-xs">
                                  Invite{'\n'}Investors
                                </Text>
                                <Text className="text-foreground/80 w-1/3 text-center text-xs">
                                  Investor{'\n'}Invests
                                </Text>
                                <Text className="text-foreground/80 w-1/3 text-center text-xs">
                                  You{'\n'}Earned
                                </Text>
                              </View>

                              <View className="bg-foreground/20 relative mt-3 h-1 w-4/5 rounded-full">
                                <View className="bg-foreground absolute -top-1 left-0 h-3 w-3 rounded-full" />
                                <View className="bg-foreground absolute -top-1 left-1/2 h-3 w-3 rounded-full" />
                                <View className="bg-foreground absolute -top-1 right-0 h-3 w-3 rounded-full" />
                              </View>
                            </View>

                            <Button
                              className="mt-8 w-full rounded-2xl"
                              onPress={handleSharePress}
                              variant="tertiary"
                            >
                              <Button.Label>Invite Now</Button.Label>
                            </Button>
                          </Dialog.Content>
                        </Dialog.Overlay>
                      </Dialog.Portal>
                    </Dialog>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View className="mt-2 gap-2 py-2">
          <View className="flex-row items-center justify-between px-1">
            <Text className="text-accent text-base font-bold">This Month</Text>
          </View>
          <Card className="bg-surface rounded-3xl p-5">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-foreground text-sm tracking-wider">
                  CURRENT MONTH EARNING
                </Text>

                <Skeleton
                  className="mt-2 h-9 w-24 rounded-lg"
                  isLoading={isReferralLoading}
                >
                  <Text className="text-foreground mt-2 text-3xl font-bold">
                    ₹ {referral?.totalComissionEarned ?? 0}
                  </Text>
                </Skeleton>
                <Skeleton
                  className="mt-3 h-3 w-24 rounded-lg"
                  isLoading={isReferralLoading}
                >
                  <Text
                    className={`mt-3 text-sm ${
                      comparison?.status === 'up'
                        ? 'text-success'
                        : 'text-danger'
                    }`}
                  >
                    {trendText}
                  </Text>
                </Skeleton>
              </View>

              <View className="bg-background/50 h-12 w-12 items-center justify-center rounded-full">
                <Text className="text-accent text-xl font-bold">₹</Text>
              </View>
            </View>
          </Card>

          <View className="mt-2 flex-row gap-4">
            <Card className="bg-surface flex-1 rounded-3xl p-3">
              <View className="h-10 w-10 items-center justify-center rounded-full">
                <Icon color="warning" icon={UserPlus} variants="soft" />
              </View>

              <Skeleton
                className="mt-4 h-9 w-12 rounded-lg"
                isLoading={isReferralLoading}
              >
                <Text className="text-foreground mt-4 text-3xl font-bold">
                  {referral?.totalActiveReferrals ?? 0}
                </Text>
              </Skeleton>

              <Text className="text-warning mt-1 text-base">New Investors</Text>
            </Card>

            <Card className="bg-surface flex-1 rounded-3xl p-3">
              <View className="h-10 w-10 items-center justify-center rounded-full">
                <Icon color="accent" icon={PiggyBank} variants="soft" />
              </View>

              <Skeleton
                className="mt-4 h-9 w-12 rounded-lg"
                isLoading={isReferralLoading}
              >
                <Text className="text-foreground mt-4 text-3xl font-bold">
                  {referral?.totalReferrals ?? 0}
                </Text>
              </Skeleton>
              <Text className="text-accent mt-1 text-base">
                Total Invitations
              </Text>
            </Card>
          </View>
        </View>
        <View className="mt-2 mb-2">
          <Text className="text-accent text-base font-bold">TOOLS</Text>
        </View>
        <PressableFeedback
          onPress={() => router.push('/(app)/(protected)/calculator')}
        >
          <Card className="bg-surface mb-4 flex-row items-center gap-4 rounded-3xl px-4 py-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl">
              <Image
                className="h-14 w-14"
                resizeMode="contain"
                source={require('@/assets/images/calculator.png')}
              />
            </View>

            <View className="flex-1">
              <Text
                className="text-foreground w-[90%] text-lg font-bold"
                numberOfLines={1}
              >
                Earning Calculator
              </Text>
              <Text className="text-foreground/70 mt-1 text-sm">
                Project your earnings over 3 years
              </Text>
            </View>

            <View className="ml-2">
              <Icon
                color="accent"
                icon={AltArrowRight}
                size="md"
                withWrapper={false}
              />
            </View>
          </Card>
        </PressableFeedback>
        <PressableFeedback
          onPress={() => router.push('/(app)/(protected)/rewards')}
        >
          <Card className="bg-surface mb-4 flex-row items-center gap-4 rounded-3xl px-4 py-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl">
              <Image
                className="h-14 w-14"
                resizeMode="contain"
                source={require('@/assets/images/rewards.png')}
              />
            </View>

            <View className="flex-1">
              <Text className="text-foreground text-lg font-bold">
                Your Rewards
              </Text>
              <Text className="text-foreground/70 mt-1 text-sm">
                Win trips on target achievement
              </Text>
            </View>

            <View className="ml-2">
              <Icon
                color="accent"
                icon={AltArrowRight}
                size="md"
                withWrapper={false}
              />
            </View>
          </Card>
        </PressableFeedback>

        <PressableFeedback
          // onPress={() => router.push('/(app)/(protected)/askChabi')}
          onPress={() =>
            toast.show({
              label: 'Coming soon. Stay tuned for something exciting!',
              variant: 'warning',
            })
          }
        >
          <Card className="bg-surface mb-4 flex-row items-center gap-4 rounded-3xl px-4 py-4">
            <View className="h-14 w-14 items-center justify-center rounded-2xl">
              <Image
                className="h-14 w-14"
                resizeMode="contain"
                source={require('@/assets/images/chabi-ai.png')}
              />
            </View>

            <View className="flex-1">
              <Text className="text-foreground text-lg font-bold">
                Chabi AI Assistant
              </Text>
              <Text className="text-foreground/70 mt-1 text-sm">
                AI support & training tool for partners
              </Text>
            </View>

            <View className="ml-2">
              <Icon
                color="accent"
                icon={AltArrowRight}
                size="md"
                withWrapper={false}
              />
            </View>
          </Card>
        </PressableFeedback>
      </View>
    </Container>
  );
}
