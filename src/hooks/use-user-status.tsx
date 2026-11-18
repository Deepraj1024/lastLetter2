import { useQuery } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useUserStatus = () =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi("/user-status", {
        method: "GET",
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }

      return response.data;
    },
    queryKey: ["user-status"],
  });
