import { createSchema } from "@better-fetch/fetch";
import { referralsSchema } from "../schema/referrals";

export const referrals = createSchema({
  "/referrals-summary": {
    method: "get",
    output: referralsSchema,
  },
});
