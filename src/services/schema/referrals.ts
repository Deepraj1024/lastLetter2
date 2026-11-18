import { z } from 'zod';

import { sBoolean, sNumber, tString } from './common';

const referralsSchema = z.object({
  data: z.object({
    currentMonthData: z.object({
      comparisonWithLastMonth: z.object({
        lastMonthAmount: sNumber,
        percentageChange: sNumber,
        status: tString,
      }),
      totalActiveReferrals: sNumber,
      totalAmount: sNumber,
      totalComissionEarned: sNumber,
      totalInactiveReferrals: sNumber,
      totalReferrals: sNumber,
      totalWithdrawn: sNumber,
    }),
    totalData: z.object({
      totalActiveReferrals: sNumber,
      totalAmount: sNumber,
      totalComissionEarned: sNumber,
      totalInactiveReferrals: sNumber,
      totalReferrals: sNumber,
      totalWithdrawn: sNumber,
    }),
    wallet: z.object({
      availableBalance: sNumber,
      balance: sNumber,
      id: sNumber,
      lockedBalance: sNumber,
      status: tString,
      totalCredit: sNumber,
      totalDebit: sNumber,
    }),
  }),
  message: tString,
  success: sBoolean,
});

type ReferralsResponse = z.infer<typeof referralsSchema>;

export type { ReferralsResponse };
export { referralsSchema };
