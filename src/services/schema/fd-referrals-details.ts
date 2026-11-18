import { z } from 'zod';

import { sBoolean, sDate, sNumber, tString } from './common';

const fdDetails = z.object({
  data: z
    .object({
      currentMonthData: z
        .object({
          monthFdAmount: sNumber.nullish(),
          monthFdCount: sNumber.nullish(),
        })
        .nullish(),

      fdList: z
        .array(
          z.object({
            amount: sNumber.nullish(),
            createdAt: sDate.nullish(),
            currentAmount: sNumber.nullish(),
            id: tString.nullish(),
            interestPaidTillDate: sNumber.nullish(),
            interestPayoutFrequency: tString.nullish(),
            interestToEarn: sNumber.nullish(),
            isFemale: sBoolean.nullish(),
            isSeniorCitizen: sBoolean.nullish(),
            issuerName: tString.nullish(),
            issuerType: tString.nullish(),
            jid: tString.nullish(),
            maturityAmount: sNumber.nullish(),
            maturityDate: tString.nullish(),
            paymentStatus: tString.nullish(),
            roi: sNumber.nullish(),
            startDate: tString.nullish(),
            status: tString.nullish(),
            templateName: tString.nullish(),
            tenureDays: sNumber.nullish(),
            updatedAt: tString.nullish(),
          })
        )
        .nullish(),

      fdProfile: z
        .object({
          aadhaarVerified: sBoolean.nullish(),
          bankAdded: sBoolean.nullish(),
          fdUserId: tString.nullish(),
          fullName: tString.nullish(),
          mobileNumber: tString.nullish(),
          onboardingDate: tString.nullish(),
          panVerified: sBoolean.nullish(),
          status: tString.nullish(),
          vkycCompleted: sBoolean.nullish(),
        })
        .nullish(),

      profile: z
        .object({
          email: tString.nullish(),
          id: tString.nullish(),
          joiningDate: tString.nullish(),
          name: tString.nullish(),
          phoneNumber: tString.nullish(),
        })
        .nullish(),

      totalData: z
        .object({
          totalActiveFds: sNumber.nullish(),
          totalFdAmount: sNumber.nullish(),
          totalInterestEarned: sNumber.nullish(),
          totalMaturedFds: sNumber.nullish(),
          totalMaturityAmount: sNumber.nullish(),
        })
        .nullish(),
    })
    .nullish(),

  message: tString.nullish(),
  success: sBoolean.nullish(),
});

export { fdDetails };
