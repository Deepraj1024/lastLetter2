import { z } from 'zod';

import { sBoolean, sNumber, tString } from './common';

const fdReferrals = z.object({
  count: sNumber.optional(),
  data: z.array(
    z
      .object({
        activeFdCount: sNumber,
        email: tString,
        hasFd: sBoolean,
        joiningDate: tString,
        maturedFdCount: sNumber,
        name: tString,
        phoneNumber: tString,
        totalFdAmount: sNumber,
        totalInterestEarned: sNumber,
        userId: tString,
      })
      .optional()
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
  summary: z.object({
    totalFdAmount: sNumber.default(0),
    totalReferrals: sNumber.default(0),
    totalWithFd: sNumber.default(0),
    totalWithoutFd: sNumber.default(0),
  }),
});
export { fdReferrals };
