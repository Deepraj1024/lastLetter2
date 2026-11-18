import { z } from 'zod';

import { sBoolean, sDate, sNumber, tString } from './common';

const withdrawlSchema = z.object({
  data: z.array(
    z.object({
      amount: sNumber,
      createdAt: sDate,
      id: sNumber,
      note: tString,
      status: tString,
      utr: tString,
    })
  ),
  message: tString,
  pagination: z.object({
    currentPage: sNumber,
    hasNextPage: sBoolean,
    hasPrevPage: sBoolean,
    limit: sNumber,
    totalPages: sNumber,
    totalRecords: sNumber,
  }),
  success: sBoolean,
  wallet: z.object({
    availableBalance: sNumber,
    balance: sNumber,
    id: sNumber,
    lockedBalance: sNumber,
    status: tString,
    totalCredit: sNumber,
    totalDebit: sNumber,
  }),
});

const withdrawlDetailSchema = z.object({
  data: z.object({
    amount: z.number(),
    createdAt: z.string(),
    description: z.string().nullish(),
    history: z.array(
      z
        .object({
          actionBy: z.string(),
          createdAt: z.string(),
          id: z.number(),
          newStatus: z.string(),
          note: z.string(),
          previousStatus: z.null(),
        })
        .nullish()
    ),
    id: z.number(),
    payoutDestination: z.object({
      agentName: z.string(),
      transferType: z.string(),
      upiId: z.string(),
    }),
    processedAt: z.null(),
    referenceId: z.null(),
    requestedAt: z.string(),
    status: z.string(),
    wallet: z.object({
      currentWalletBalance: z.number(),
      id: z.number(),
      walletStatus: z.string(),
    }),
  }),
  success: sBoolean,
});

type WithdrawlDetailSchema = z.infer<typeof withdrawlDetailSchema>;

type WithdrawlSchema = z.infer<typeof withdrawlSchema>;

export type { WithdrawlDetailSchema, WithdrawlSchema };
export { withdrawlDetailSchema, withdrawlSchema };
