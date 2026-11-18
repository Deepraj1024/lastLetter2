import { z } from "zod";
import { tString } from "./common";

export const panCardSchema = z.object({
  panNumber: tString.min(10).max(10),
});

export const panCardResponseSchema = z.object({
  agent: z.object({
    aadhaarVerified: z.boolean(),
    id: z.string(),
    kycStatus: z.string(),
    panVerified: z.boolean(),
    selfieVerified: z.boolean(),
  }),
  digio: z.object({
    category: z.string(),
    full_name: z.string(),
    pan: z.string(),
    status: z.string(),
  }),
  kyc: z.object({ id: z.string(), status: z.string() }),
  message: z.string(),
  success: z.boolean(),
});
