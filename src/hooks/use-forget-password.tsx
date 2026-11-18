import { useMutation } from "@tanstack/react-query";
import type {
  ForgetPasswordSchema,
  ForgetPasswordVerifyBody,
  ResetPasswordBody,
} from "@/services/schema/forget-password";
import { baseApi } from "../services/apis";

export const useForgetPasswordSendOtp = () =>
  useMutation({
    mutationFn: async (body: ForgetPasswordSchema) => {
      const response = await baseApi("/forgot-password/send-otp", {
        body,
        method: "POST",
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      console.log("forget password send otp response", response.data);
      return response.data;
    },
  });

export const useForgetPasswordVerify = () =>
  useMutation({
    mutationFn: async (body: ForgetPasswordVerifyBody) => {
      const response = await baseApi("/forgot-password/verify-otp", {
        body,
        method: "POST",
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      console.log("forget password verify otp response", response.data);
      return response.data;
    },
  });
export const useResetPassword = () =>
  useMutation({
    mutationFn: async (body: ResetPasswordBody) => {
      const response = await baseApi("/reset-password", {
        body,
        method: "POST",
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      console.log("reset password response", response.data);

      return response.data;
    },
  });
