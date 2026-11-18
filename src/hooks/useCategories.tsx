import { useQuery } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useConversationCategory = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi("/conversation/categories", {
        method: "GET",
      });
      console.log("categories RESPONSE 👉", response);
      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response;
    },
    queryKey: ["categorirs"],
  });

export const useCategoriesQuestion = (category: string) =>
  useQuery({
    enabled: !!category,
    queryFn: async () => {
      const response = await baseApi("/conversation/categories/questions", {
        method: "GET",
        query: {
          category,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response;
    },
    queryKey: ["categories-question", category],
  });
