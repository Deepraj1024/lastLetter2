import { useMutation } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useSuggestion = () =>
  useMutation({
    mutationFn: async (body: { message: string; language: string }) => {
      const response = await baseApi("/conversation/suggestion", {
        body,
        method: "POST",
      });
      console.log("Suggestion RESPONSE 👉", response);
      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response;
    },
    mutationKey: ["suggestion"],
  });
