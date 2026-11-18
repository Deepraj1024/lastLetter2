import { z } from "zod";
import { ltString, sBoolean, tString } from "./common";

const emailBodySchema = z.object({
  email: z.email("Invalid email address").toLowerCase(),
});

const phoneBodySchema = z.object({
  mobileNumber: tString.regex(/^\d{10}$/, { error: "Invalid phone number" }),
});

const emailOtpBodySchema = z.object({
  email: z.email("Invalid email address"),
  otp: tString.regex(/^\d{6}$/, { error: "OTP must be 6 digits" }),
});

const phoneOtpBodySchema = z.object({
  mobileNumber: tString.regex(/^\d{10}$/, { error: "Invalid phone number" }),
  otp: tString.regex(/^\d{6}$/, { error: "OTP must be 6 digits" }),
});

const emailResponseSchema = z.object({
  message: ltString,
  success: sBoolean,
});

const phoneResponseSchema = z.object({
  message: ltString,
  success: sBoolean,
});

type EmailResponse = z.infer<typeof emailResponseSchema>;
type PhoneResponse = z.infer<typeof phoneResponseSchema>;
type EmailBody = z.infer<typeof emailBodySchema>;
type PhoneBody = z.infer<typeof phoneBodySchema>;
type EmailOtpBody = z.infer<typeof emailOtpBodySchema>;
type PhoneOtpBody = z.infer<typeof phoneOtpBodySchema>;

export type {
  EmailBody,
  EmailOtpBody,
  EmailResponse,
  PhoneBody,
  PhoneOtpBody,
  PhoneResponse,
};

export {
  emailBodySchema,
  emailOtpBodySchema,
  emailResponseSchema,
  phoneBodySchema,
  phoneOtpBodySchema,
  phoneResponseSchema,
};
