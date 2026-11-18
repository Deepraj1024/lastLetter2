import { createSchema } from "@better-fetch/fetch";
import { rewardsSchema } from "../schema/rewards";

export const rewards = createSchema({
  "/rewards": {
    method: "get",
    output: rewardsSchema,
  },
});
