import { z } from 'zod';

import { ltString, sBoolean, sDate, sNumber, tString } from './common';

const transactionParamsSchema = z.object({
  month: sNumber.optional(),
  name: ltString.lowercase().optional(),
  year: sNumber.default(2026),
});

const recentTransactionSchema = z.object({
  data: z.array(
    z.object({
      commissionAmount: sNumber,
      commissionPercent: sNumber,
      createdAt: sDate,
      id: sNumber,
      investmentAmount: sNumber,
      investmentType: tString,
      metalType: tString,
      preTaxAmount: sNumber,
      transactionId: tString,
      userEmail: tString,
      userName: tString,
    })
  ),
  success: sBoolean,
});

type RecentTransactionSchema = z.infer<typeof recentTransactionSchema>;
type TransactionParamsSchema = z.infer<typeof transactionParamsSchema>;

export type { RecentTransactionSchema, TransactionParamsSchema };
export { recentTransactionSchema, transactionParamsSchema };
