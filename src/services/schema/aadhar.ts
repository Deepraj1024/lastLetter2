import { z } from 'zod';

import { ltString, sBoolean, sDate, tString } from './common';

const aadharBodySchema = z.object({
  name: ltString,
  phone: ltString,
});
const aadharResponseSchema = z.object({
  access_token: ltString,
  access_token_expiry: sDate,
  kid_request_id: ltString,
  message: ltString,
  success: sBoolean,
});

// Digio KYC lifecycle statuses.
const kycStatusSchema = z.enum([
  'approval_pending',
  'approved',
  'rejected',
  'failed',
]);

// Failure responses (e.g. kid not found, under-age, already-linked) return
// `success: false` plus `message` / `isMinAgeEligible` and omit the KYC
// detail fields — so every detail field must be optional for the body to
// survive better-fetch's output validation instead of throwing.
const aadharStatusSchema = z.object({
  aadhaar_last4: tString.optional(),
  address: tString.optional(),
  city: tString.optional(),
  dob: tString.nullish(),
  father_name: tString.optional(),
  gender: tString.nullish(),
  image: tString.optional(),
  isMinAgeEligible: sBoolean.optional(),
  kyc_status: kycStatusSchema.optional(),
  message: tString.optional(),
  name: tString.nullish(),
  pincode: tString.optional(),
  state: tString.optional(),
  success: sBoolean,
});

type AadharBody = z.infer<typeof aadharBodySchema>;
type AadharResponse = z.infer<typeof aadharResponseSchema>;
type AadharStatus = z.infer<typeof aadharStatusSchema>;

export type { AadharBody, AadharResponse, AadharStatus };
export { aadharBodySchema, aadharResponseSchema, aadharStatusSchema };
