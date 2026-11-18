import { z } from "zod";
import { sBoolean, sNumber } from "./common";

const commissionCalculatorSchema = z.object({
  data: z.object({
    year1Earnings: sNumber,
    year2Earnings: sNumber,
    year3Earnings: sNumber,
  }),
  success: sBoolean,
});
type CommissionCalculatorSchema = z.infer<typeof commissionCalculatorSchema>;

export type { CommissionCalculatorSchema };
export { commissionCalculatorSchema };
