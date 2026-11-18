import { createSchema } from "@better-fetch/fetch";
import z from "zod";
import { referraldetails } from "../schema/referral-details";

export const referralDetail = createSchema({
  "/referrals/details/{userId}": {
    method: "get",
    output: referraldetails,
    query: z.object({
      userId: z.string(),
    }),
  },
});
