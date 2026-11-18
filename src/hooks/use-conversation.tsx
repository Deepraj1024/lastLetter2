import { useMutation } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useConversation = () =>
  useMutation({
    mutationFn: async (body: { message: string; language: string }) => {
      const response = await baseApi("/conversation", {
        body,
        method: "POST",
      });
      console.log("Conversation RESPONSE 👉", response);
      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response;
    },
    mutationKey: ["conversation"],
  });
