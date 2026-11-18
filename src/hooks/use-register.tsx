import { useMutation } from "@tanstack/react-query";
import type { RegisterBody } from "@/services/schema/register";
import { baseApi } from "../services/apis";

export const useRegister = () =>
  useMutation({
    mutationFn: async (body: RegisterBody) => {
      const response = await baseApi("/register", {
        body,
        method: "POST",
      });

      if (response.error) {
        throw new Error(response.error.message);
      }
      console.log("REGISTER RESPONSE 👉", response.data);
      return response.data;
    },
  });
