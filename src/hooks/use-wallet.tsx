import { useQuery } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useWallet = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi("/wallet", {
        method: "GET",
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }
      return response.data;
    },
    queryKey: ["wallet"],
  });
