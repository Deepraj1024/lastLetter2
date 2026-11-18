import { useMutation } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: async () => {
      const response = await baseApi("/delete-user", {
        method: "POST",
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    mutationKey: ["delete"],
  });
