import { z } from "zod";
import { sBoolean, sNumber, tString } from "./common";

export const rewardsSchema = z.object({
  data: z.array(
    z.object({
      details: z.object({
        fd_amount: sNumber,
        fd_label: tString,
        investment_amount: sNumber,
        investment_label: tString,
      }),
      id: tString,
      name: tString,
    })
  ),
  message: tString,
  success: sBoolean,
});
