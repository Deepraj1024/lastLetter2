import { Tabs } from 'expo-router';
import { useThemeColor } from 'heroui-native/hooks';
import { Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '@/components/home/header';
import { Icon } from '@/components/icons';
import { Home } from '@/components/icons/home';
import { HomeOutline } from '@/components/icons/home-outline';
import { UserAdd } from '@/components/icons/user-add';
import { UserOutline } from '@/components/icons/user-outline';
import { WalletMoney } from '@/components/icons/wallet-money';
import { WalletOutline } from '@/components/icons/wallet-outline';
import { cn } from '@/utils/style';

export default function TabLayout() {
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const accentColor = useThemeColor('accent');
  const backgroundColor = useThemeColor('background');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accentColor,
        tabBarLabel(props) {
          return (
            <Text
              className={cn(
                'mt-1 font-medium text-xs',
                props.focused ? 'text-accent' : 'text-foreground'
              )}
            >
              {props.children}
            </Text>
          );
        },
        tabBarStyle: {
          backgroundColor,
          borderColor: accentColor,
          borderLeftWidth: 0.17,
          borderRightWidth: 0.17,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          borderTopWidth: 4,
          height: height * 0.1 + bottom,
          overflow: 'hidden',
          paddingBottom: bottom,
          paddingTop: 16,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          header: () => <Header className="pt-safe-or-10 pb-4" />,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Icon
                color={focused ? 'accent' : 'foreground'}
                icon={Home}
                variants="soft"
                withWrapper={false}
              />
            ) : (
              <Icon
                color={focused ? 'accent' : 'foreground'}
                icon={HomeOutline}
                // size="lg"
                variants="soft"
                withWrapper={false}
              />
            ),
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          header: () => <Header className="pt-safe-or-10 pb-4" />,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Icon
                color={focused ? 'accent' : 'foreground'}
                icon={UserOutline}
                size="lg"
                variants="soft"
                withWrapper={false}
              />
            ) : (
              <Icon
                color={focused ? 'accent' : 'foreground'}
                icon={UserAdd}
                // size="lg"
                variants="soft"
                withWrapper={false}
              />
            ),
          title: 'Investors',
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          header: () => <Header className="pt-safe-or-10 pb-4" />,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Icon
                color={focused ? 'accent' : 'foreground'}
                icon={WalletOutline}
                variants="soft"
                withWrapper={false}
              />
            ) : (
              <Icon
                color={focused ? 'accent' : 'foreground'}
                icon={WalletMoney}
                variants="soft"
                withWrapper={false}
              />
            ),
          title: 'Earnings',
        }}
      />
    </Tabs>
  );
}
