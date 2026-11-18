import { z } from "zod";
import { sBoolean, sNumber, tString } from "./common";

const referraldetails = z.object({
  data: z.object({
    currentMonthData: z.object({
      currentMonthPreTax: sNumber,
      monthCommissionEarned: sNumber,
      monthInvestment: sNumber,
    }),
    investmentList: z.array(
      z.object({
        commissionAmount: sNumber,
        commissionPercent: sNumber,
        date: tString,
        id: sNumber,
        investmentAmount: sNumber,
        investmentType: tString,
        metalType: tString,
        preTaxAmount: sNumber,
        transactionId: tString,
      })
    ),
    profile: z.object({
      email: tString,
      id: tString,
      joiningDate: tString,
      name: tString,
      phoneNumber: tString,
    }),
    totalData: z.object({
      totalCommissionEarned: sNumber,
      totalInvestment: sNumber,
      totalPreTax: sNumber,
    }),
  }),
  message: tString,
  success: sBoolean,
});

type ReferralDetails = z.infer<typeof referraldetails>;

export type { ReferralDetails };
export { referraldetails };
