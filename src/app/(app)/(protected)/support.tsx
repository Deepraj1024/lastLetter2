import { Button } from 'heroui-native/button';
import { Input } from 'heroui-native/input';
import { useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';

import { Profile } from '@/components/profile';
import { useProfile } from '@/hooks/use-profile';
import { getToken } from '@/utils/storage';

export default function Support() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { data: profile } = useProfile();

  const userName = profile?.agent.fullName || 'User';
  const userId = profile?.agent?.id || '';
  const token = getToken();
  console.log(token);
  const handleSubmit = async () => {
    const text = `*Support Request*

*Reference ID:* ${userId}

*Name:* ${userName}

*Subject:*
${subject}

*Message:*
${message}

━━━━━━━━━━━━━━━━━━
Sent from Chabi Partner App`;

    const url = `https://wa.me/918879696779?text=${encodeURIComponent(text)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Unable to open WhatsApp:', error);
    }
  };

  return (
    <Profile.Container title="Support">
      <ScrollView
        className="bg-background flex-1"
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-7">
          <Text className="text-foreground text-2xl font-bold">
            Contact Support
          </Text>

          <Text className="text-foreground mt-2 text-sm leading-5">
            Having an issue? Tell us what happened and our support team will
            help you resolve it.
          </Text>
        </View>

        <View className="bg-surface border-border rounded-3xl border p-5">
          <View className="gap-6">
            <View>
              <Text className="text-foreground mb-2 text-sm font-semibold">
                Subject
              </Text>

              <Input
                className="bg-background border-border rounded-2xl border"
                maxLength={100}
                onChangeText={setSubject}
                placeholder="e.g. Unable to login"
                value={subject}
              />
            </View>

            {/* Message */}
            <View>
              <Text className="text-foreground mb-2 text-sm font-semibold">
                Message
              </Text>

              <Input
                className="bg-background border-border min-h-36 rounded-2xl border"
                multiline
                numberOfLines={7}
                onChangeText={setMessage}
                placeholder="Describe your issue in detail..."
                textAlignVertical="top"
                value={message}
              />
            </View>

            <Button
              className="bg-accent mt-1 h-14 rounded-2xl"
              isDisabled={!(subject.trim() && message.trim())}
              onPress={handleSubmit}
              size="lg"
            >
              <Text className="text-accent-foreground text-base font-semibold">
                Send via WhatsApp
              </Text>
            </Button>
          </View>
        </View>

        {/* Bottom Note */}
        <View className="mt-6 items-center px-6">
          <Text className="text-warning text-center text-xs leading-5">
            Your request will be shared securely with the Chabi Partner support
            team.
          </Text>
        </View>
      </ScrollView>
    </Profile.Container>
  );
}
