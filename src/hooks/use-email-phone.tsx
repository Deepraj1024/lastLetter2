import { useMutation } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useEmail = () =>
  useMutation({
    mutationFn: async (body: { email: string }) => {
      const response = await baseApi("/register/email/send-otp", {
        body,
        method: "POST",
      });
      console.log("EMAIL RESPONSE 👉", response.data);
      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    mutationKey: ["email"],
  });
export const useVerifyEmailOtp = () =>
  useMutation({
    mutationFn: async (body: { email: string; otp: string }) => {
      const response = await baseApi("/register/email/verify-otp", {
        body,
        method: "POST",
      });
      console.log("EMAIL RESPONSE 👉", response);
      if (response.error) {
        throw new Error(response.error?.message || "Something went wrong");
      }

      return response.data;
    },
    mutationKey: ["verify-otp"],
  });
export const useMobileNumber = () =>
  useMutation({
    mutationFn: async (body: { mobileNumber: string }) => {
      const response = await baseApi("/register/phone/send-otp", {
        body,
        method: "POST",
      });
      console.log("PHONE RESPONSE 👉", response);
      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    mutationKey: ["phone"],
  });
export const useVerifyPhoneOtp = () =>
  useMutation({
    mutationFn: async (body: { mobileNumber: string; otp: string }) => {
      const response = await baseApi("/register/phone/verify-otp", {
        body,
        method: "POST",
      });
      console.log("PHONE RESPONSE 👉", response);
      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    mutationKey: ["verify-otp"],
  });
