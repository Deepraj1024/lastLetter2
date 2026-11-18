import { z } from "zod";
import { ltString, sBoolean, sDate, tString } from "./common";

export const userStatusSchema = z.object({
  agent: z.object({
    aadhaarVerified: sBoolean,
    createdAt: sDate,
    fullName: ltString,
    id: tString,
    kycStatus: tString,
    panVerified: sBoolean,
    selfieVerified: sBoolean,
    userStatus: tString,
  }),
  message: tString,
  success: sBoolean,
});
