import { createSchema } from "@better-fetch/fetch";
import { commissionCalculatorSchema } from "../schema/commission-calculator";

export const commissionCalculator = createSchema({
  "/commission-calculator/percentage": {
    method: "get",
    output: commissionCalculatorSchema,
  },
});
