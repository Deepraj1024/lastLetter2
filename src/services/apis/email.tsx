import { createSchema } from "@better-fetch/fetch";
import {
  emailBodySchema,
  emailOtpBodySchema,
  emailResponseSchema,
  phoneBodySchema,
  phoneOtpBodySchema,
  phoneResponseSchema,
} from "../schema/email-phone";

export const emailPhone = createSchema({
  "/register/email/send-otp": {
    input: emailBodySchema,
    method: "post",
    output: emailResponseSchema,
  },
  "/register/email/verify-otp": {
    input: emailOtpBodySchema,
    method: "post",
    output: emailResponseSchema,
  },
  "/register/phone/send-otp": {
    input: phoneBodySchema,
    method: "post",
    output: phoneResponseSchema,
  },
  "/register/phone/verify-otp": {
    input: phoneOtpBodySchema,
    method: "post",
    output: phoneResponseSchema,
  },
});
