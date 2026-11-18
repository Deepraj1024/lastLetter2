import { BottomSheet } from 'heroui-native/bottom-sheet';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ScrollView, Text, View } from 'react-native';

import { CommissionCard } from '@/components/commision-calculator';
import { Icon } from '@/components/icons';
import { AskAi } from '@/components/icons/ask-ai';
import { CourseUp } from '@/components/icons/course-up';
import { GrowUp } from '@/components/icons/grow-up';
import { Refresh } from '@/components/icons/refresh';
import { UserAdd } from '@/components/icons/user-add';
import { UserPlus } from '@/components/icons/user-plus';
import { WalletMoney } from '@/components/icons/wallet-money';
import { ImageBackground } from '@/components/images';
import { Profile } from '@/components/profile';
import { Input } from '@/components/ui/input';
import { useCalcutaion } from '@/hooks/use-calculator';

type Frequency = 'daily' | 'monthly' | 'oneTime';

const commissionData = [
  {
    color: 'bg-success',
    text: 'You earn 1% upfront on every new investor you bring in.',
    title: 'Year 1',
  },
  {
    color: 'bg-success',
    text: "You earn 1% on new investors plus 0.75% on last year's investors who keep investing.",
    title: 'Year 2',
  },
  {
    color: 'bg-success',
    text: 'All three years of investors are paying you — 1% on new, 0.75% on Year 2 investors, and 0.5% on your existing Year 1 investors.',
    title: 'Year 3',
  },
  {
    color: 'bg-warning',
    text: 'You continue to earn a 0.5% trail every year on the total assets of all investors who stay with you.',
    title: 'After Year 3',
  },
];

export default function Calculator() {
  const { control } = useForm({
    defaultValues: {
      customers: '75',
      investment: '100',
    },
    mode: 'onChange',
  });

  const customers = useWatch({ control, name: 'customers' }) || '75';
  const investment = useWatch({ control, name: 'investment' }) || '100';

  const [open, setOpen] = useState(false);
  const parsedCustomers = Number(customers) || 0;
  const parsedInvestment = Number(investment) || 0;

  const { data } = useCalcutaion();
  const year1Earnings = data?.data.year1Earnings || 0;
  const year2Earnings = data?.data.year2Earnings || 0;
  const year3Earnings = data?.data.year3Earnings || 0;

  const clampValue = (value: string) => {
    const cleaned = value.replaceAll(/[^0-9]/g, '');
    const num = Number(cleaned);
    if (num > 50_000) {
      return '50000';
    }
    return cleaned;
  };

  // Component for the Rupee symbol
  const RupeeSymbol = () => (
    <Text className="text-foreground mr-1 text-2xl font-bold">₹</Text>
  );

  const calculateProjection = (
    frequency: Frequency,
    customers: number,
    investment: number
  ) => {
    let annualCustomers = 0;
    let annualAUM = 0;
    const rollingMonthsFactor = 78;

    if (frequency === 'daily') {
      annualCustomers = customers * 12;
      const baseMonthlyAddition = customers * investment * 30;
      annualAUM = baseMonthlyAddition * rollingMonthsFactor;
    }

    const year1 = annualAUM * (year1Earnings / 100);
    const year2 = year1 + annualAUM * (year2Earnings / 100);
    const year3 = year2 + annualAUM * (year3Earnings / 100);
    const year4 = annualAUM * 4 * (year3Earnings / 100);

    return {
      annualAUM: Math.round(annualAUM),
      annualCustomers: Math.round(annualCustomers),
      year1: Math.round(year1),
      year2: Math.round(year2),
      year3: Math.round(year3),
      year4: Math.round(year4),
    };
  };

  const formatIndianCurrency = (value: number): string => {
    if (value === 0 || Number.isNaN(value)) {
      return '₹0';
    }
    const absoluteValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    let formattedString = '';

    if (absoluteValue >= 10_000_000) {
      formattedString = `${(absoluteValue / 10_000_000).toFixed(2)} Cr`;
    } else if (absoluteValue >= 100_000) {
      formattedString = `${(absoluteValue / 100_000).toFixed(2)}L`;
    } else {
      formattedString = new Intl.NumberFormat('en-IN').format(absoluteValue);
    }

    return `${sign}₹${formattedString}`;
  };

  const result = calculateProjection(
    'daily',
    parsedCustomers,
    parsedInvestment
  );

  return (
    <Profile.Container
      className="z-10"
      onRightActionPress={() => setOpen(true)}
      rightAction
      scrollable={false}
    >
      <View className="absolute inset-x-0 top-0 -z-10 overflow-hidden rounded-b-4xl">
        <ImageBackground
          className="h-64 justify-end"
          contentFit="cover"
          contentPosition="bottom center"
          source={require('@/assets/images/commission-calculator.png')}
        >
          <View className="pointer-events-none px-4 pb-6">
            <Text className="text-foreground/70 text-xl font-bold">
              Earning
            </Text>
            <Text className="text-foreground/80 text-3xl font-extrabold">
              Calculator
            </Text>
          </View>
        </ImageBackground>
      </View>

      <ScrollView className="mt-40 flex-1">
        <View className="bg-background rounded-t-3xl p-3">
          <Text className="text-foreground/80 font-mono text-sm">
            INVESTORS ONBOARD PER MONTH
          </Text>

          <View className="mt-2">
            <Input
              className="bg-surface text-foreground h-14 rounded-2xl text-xl font-bold"
              control={control}
              endComponent={() => (
                <Text className="text-accent text-sm font-semibold">
                  INVESTORS
                </Text>
              )}
              keyboardType="number-pad"
              name="customers"
              onChangeTextCustom={clampValue}
              startIcon={UserAdd}
            />
          </View>

          <Text className="text-foreground/80 mt-4 font-semibold">
            AVG. INVESTMENT PER USER DAILY
          </Text>

          <View className="mt-2">
            <Input
              className="bg-surface text-foreground h-14 rounded-2xl text-2xl font-bold"
              control={control}
              endComponent={() => (
                <Text className="text-accent/80 text-sm font-semibold">
                  PER DAY
                </Text>
              )}
              keyboardType="number-pad"
              name="investment"
              onChangeTextCustom={clampValue}
              startComponent={RupeeSymbol}
            />
          </View>

          <View className="border-border bg-accent/60 mt-6 flex-row justify-between rounded-2xl border p-3">
            <View className="flex-1">
              <Text className="text-foreground/60 text-xs font-medium uppercase">
                ANNUAL INVESTORS
              </Text>
              <View className="mt-2 flex-row items-center gap-2">
                <Icon
                  color="accent"
                  icon={UserPlus}
                  size="sm"
                  withWrapper={false}
                />
                <Text className="text-foreground text-2xl font-bold">
                  {result.annualCustomers}
                </Text>
              </View>
            </View>

            <View className="flex-1 items-end">
              <Text className="text-foreground/60 text-right text-xs font-medium uppercase">
                PROJECTED AUM
              </Text>
              <View className="mt-2 flex-row items-center gap-2">
                <Icon
                  color="accent"
                  icon={WalletMoney}
                  size="sm"
                  withWrapper={false}
                />
                <Text className="text-foreground text-right text-xl font-bold">
                  {formatIndianCurrency(result.annualAUM)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 p-2">
          <Text className="text-foreground/70 mb-2 text-base font-semibold">
            EARNING TIMELINE
          </Text>
          <CommissionCard
            amount={`₹${result.year1.toLocaleString('en-IN')}`}
            icon={CourseUp}
            subtitle="1% Flat Earning"
            tag="START EARNING"
            year="YEAR 01"
          />
          <CommissionCard
            amount={`₹${result.year2.toLocaleString('en-IN')}`}
            icon={Refresh}
            subtitle="1% New + 0.75% existing investors"
            tag="REGULAR INCOME"
            year="YEAR 02"
          />
          <CommissionCard
            amount={`₹${result.year3.toLocaleString('en-IN')}`}
            icon={GrowUp}
            subtitle="Multi-cohort Yield"
            tag="DOUBLE YOUR INCOME"
            year="YEAR 03"
          />
          <CommissionCard
            amount={`₹${result.year4.toLocaleString('en-IN')}`}
            highlight
            icon={AskAi}
            subtitle="0.5% Each Year"
            tag="ENJOY YOUR ROYALTY"
            year="YEAR 04+"
          />
        </View>

        <BottomSheet isOpen={open} onOpenChange={setOpen}>
          <BottomSheet.Portal>
            <BottomSheet.Overlay className="bg-background/40" />
            <BottomSheet.Content
              backgroundClassName="bg-background rounded-t-3xl"
              className="bg-background rounded-t-3xl px-6 pt-6"
              enableOverDrag={false}
              snapPoints={['40%', '75%']}
            >
              <BottomSheet.Title className="text-foreground text-base font-bold">
                Earning Structure
              </BottomSheet.Title>
              <BottomSheet.Description className="text-foreground/70 mt-4 text-sm">
                The more investors you onboard each year, the more your Earning
                layers and grows over time:
              </BottomSheet.Description>
              <View className="mt-4 gap-6">
                {commissionData.map((item) => (
                  <View className="flex-row items-start" key={item.title}>
                    <View
                      className={`mt-2 mr-4 h-2.5 w-2.5 rounded-full ${item.color}`}
                    />
                    <Text className="text-foreground/90 flex-1 text-sm">
                      <Text className="text-foreground font-bold">
                        {item.title}:{' '}
                      </Text>
                      {item.text}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="bg-warning/10 mt-4 rounded-3xl p-5">
                <Text className="text-warning text-sm">
                  <Text className="font-bold">Simple idea:</Text> build
                  investors for the first few years, and their investments can
                  keep paying you a steady trail income year after year.
                </Text>
              </View>
            </BottomSheet.Content>
          </BottomSheet.Portal>
        </BottomSheet>
      </ScrollView>
    </Profile.Container>
  );
}
