import { z } from "zod";
import { sBoolean, tString } from "./common";

const forgetPasswordSchema = z.object({
  email: z.email(),
});

const forgetPasswordVerifyBody = z.object({
  email: z.email(),
  otp: tString,
});

const resetPasswordBody = z.object({
  confirmPassword: tString,
  newPassword: tString,
  resetToken: tString,
});

const forgetPasswordResponseSchema = z.object({
  message: tString,
  success: sBoolean,
});

const forgetPasswordVerifyResponseSchema = z.object({
  message: tString,
  resetToken: tString,
  success: sBoolean,
});

type ForgetPasswordResponse = z.infer<typeof forgetPasswordResponseSchema>;
type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
type ForgetPasswordVerifyBody = z.infer<typeof forgetPasswordVerifyBody>;
type ForgetPasswordVerifyResponse = z.infer<
  typeof forgetPasswordVerifyResponseSchema
>;
type ResetPasswordBody = z.infer<typeof resetPasswordBody>;

export type {
  ForgetPasswordResponse,
  ForgetPasswordSchema,
  ForgetPasswordVerifyBody,
  ForgetPasswordVerifyResponse,
  ResetPasswordBody,
};
export {
  forgetPasswordResponseSchema,
  forgetPasswordSchema,
  forgetPasswordVerifyBody,
  forgetPasswordVerifyResponseSchema,
  resetPasswordBody,
};
