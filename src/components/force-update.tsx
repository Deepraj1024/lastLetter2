import { Button } from 'heroui-native/button';
import { Card } from 'heroui-native/card';
import { Typography } from 'heroui-native/text';
import { Linking, ScrollView, View } from 'react-native';

import type { AppVersion } from '@/services/schema/app-version';

import { Icon } from './icons';
import { AltArrowRight } from './icons/alt-arrow-right';
import { Image } from './images';
import { Profile } from './profile';

interface ForceUpdateProps {
  localVersion: string;
  remoteVersion: AppVersion;
}

const formatVersion = (version: string) => {
  const value = version.trim();

  if (!value) {
    return 'v0.0.0';
  }

  if (value.startsWith('v')) {
    return value;
  }

  return `v${value}`;
};

const getHighlights = (changeLog: string) =>
  changeLog
    .split('\n')
    .map((line) => line.replace(/^[\s•-]+/u, '').trim())
    .filter(Boolean);

export const ForceUpdate = ({
  localVersion,
  remoteVersion,
}: ForceUpdateProps) => {
  const highlights = getHighlights(remoteVersion.changeLog ?? '');

  const handleUpdate = async () => {
    try {
      await Linking.openURL(remoteVersion.appStoreUrl);
    } catch (error) {
      console.error('Unable to open app store:', error);
    }
  };

  return (
    <Profile.Container scrollable={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="grow px-6 pt-10 pb-6"
      >
        <View className="items-center">
          {/* App icon */}
          <View className="bg-accent-soft mb-6 size-24 items-center justify-center rounded-3xl">
            <Image
              className="size-20 rounded-3xl"
              source={require('@/assets/images/agent.png')}
            />
          </View>

          {/* Title */}
          <Typography.Heading className="text-center" type="h3">
            A better Chabi-Partner is ready
          </Typography.Heading>

          <Typography.Paragraph
            align="center"
            className="mt-3 max-w-sm"
            color="muted"
            type="body-sm"
          >
            Update to the latest version for a faster, safer, and smoother
            experience.
          </Typography.Paragraph>

          {/* Version */}
          <View className="mt-7 flex-row items-center gap-x-2">
            <View className="bg-surface border-border rounded-full border px-3 py-1.5">
              <Typography.Paragraph color="muted" type="body-xs">
                {formatVersion(localVersion)}
              </Typography.Paragraph>
            </View>

            <Icon
              icon={AltArrowRight}
              variants="transparent"
              withWrapper={false}
            />

            <View className="bg-accent-soft border-border rounded-full border px-3 py-1.5">
              <Typography.Paragraph className="text-accent" type="body-xs">
                {formatVersion(remoteVersion.version)}
              </Typography.Paragraph>
            </View>
          </View>

          {/* What's new */}
          <Card className="border-border mt-8 w-full rounded-3xl border p-5">
            <Typography.Paragraph type="body-sm" weight="semibold">
              What&apos;s new
            </Typography.Paragraph>

            {highlights.length > 0 ? (
              <View className="mt-4 gap-y-3">
                {highlights.slice(0, 4).map((item, index) => (
                  <View
                    className="flex-row items-start gap-x-3"
                    key={`${item}-${index}`}
                  >
                    <View className="bg-accent mt-1.5 size-1.5 rounded-full" />

                    <Typography.Paragraph
                      className="flex-1 leading-5"
                      color="muted"
                      type="body-sm"
                    >
                      {item}
                    </Typography.Paragraph>
                  </View>
                ))}
              </View>
            ) : (
              <Typography.Paragraph
                className="mt-3"
                color="muted"
                type="body-sm"
              >
                Performance improvements and important security updates.
              </Typography.Paragraph>
            )}
          </Card>

          <Typography.Paragraph
            align="center"
            className="mt-5 px-4"
            color="muted"
            type="body-xs"
          >
            Your gold, vault, and account remain safe and unchanged.
          </Typography.Paragraph>
        </View>
      </ScrollView>

      <View className="px-6 pt-3 pb-5">
        <Button className="rounded-2xl" onPress={handleUpdate} size="lg">
          <Button.Label>Update Chabi-Partner</Button.Label>
        </Button>

        <Typography.Paragraph
          align="center"
          className="mt-3"
          color="muted"
          type="body-xs"
        >
          It only takes a minute.
        </Typography.Paragraph>
      </View>
    </Profile.Container>
  );
};
