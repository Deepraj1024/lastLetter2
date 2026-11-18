import { createSchema } from "@better-fetch/fetch";
import {
  referralParamsSchema,
  referralsUserSchema,
} from "../schema/referrals-user";

export const referralsUser = createSchema({
  "/referrals": {
    method: "get",
    output: referralsUserSchema,
    params: referralParamsSchema,
  },
});
