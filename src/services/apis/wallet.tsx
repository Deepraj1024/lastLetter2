import { createSchema } from "@better-fetch/fetch";
import { walletSchema } from "../schema/wallet";

export const wallet = createSchema({
  "/wallet": {
    method: "get",
    output: walletSchema,
  },
});
