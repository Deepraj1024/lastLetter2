import { createSchema } from "@better-fetch/fetch";
import {
  recentTransactionSchema,
  transactionParamsSchema,
} from "../schema/recent-transaction";

export const recentTransaction = createSchema({
  "/recent-transactions": {
    method: "get",
    output: recentTransactionSchema,
    query: transactionParamsSchema,
  },
});
