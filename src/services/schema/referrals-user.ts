import { z } from "zod";
import { sBoolean, sNumber, tString } from "./common";

const referralParamsSchema = z.object({
  search: tString,
  sortBy: tString,
  sortorder: tString,
  status: tString,
});

const referralsUserSchema = z.object({
  count: sNumber,
  data: z.array(
    z.object({
      email: tString,
      isInvested: sBoolean,
      joiningDate: tString,
      name: tString,
      totalInvestment: sNumber,
      userId: tString,
    })
  ),
  message: tString,
  success: sBoolean,
});
type ReferralParamsSchema = z.infer<typeof referralParamsSchema>;
type ReferralsUserSchema = z.infer<typeof referralsUserSchema>;

export type { ReferralParamsSchema, ReferralsUserSchema };
export { referralParamsSchema, referralsUserSchema };
