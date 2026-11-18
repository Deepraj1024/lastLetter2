import { createSchema } from "@better-fetch/fetch";
import {
  forgetPasswordResponseSchema,
  forgetPasswordSchema,
  forgetPasswordVerifyBody,
  forgetPasswordVerifyResponseSchema,
  resetPasswordBody,
} from "../schema/forget-password";

export const forgetPassword = createSchema({
  "/forgot-password/send-otp": {
    input: forgetPasswordSchema,
    method: "post",
    output: forgetPasswordResponseSchema,
  },
  "/forgot-password/verify-otp": {
    input: forgetPasswordVerifyBody,
    method: "post",
    output: forgetPasswordVerifyResponseSchema,
  },
  "/reset-password": {
    input: resetPasswordBody,
    method: "post",
  },
});
