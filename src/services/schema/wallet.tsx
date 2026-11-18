import { z } from 'zod';

import { sBoolean, sDate, sNumber, tString } from './common';

const walletSchema = z.object({
  data: z.object({
    createdAt: sDate,
    currentBalance: sNumber,
    totalCredited: sNumber,
    totalDebited: sNumber,
    updatedAt: sDate,
    walletId: sNumber,
    walletStatus: tString,
  }),
  message: tString,
  success: sBoolean,
});
type WalletSchema = z.infer<typeof walletSchema>;

export type { WalletSchema };
export { walletSchema };
