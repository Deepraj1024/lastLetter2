import { useQuery } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";

export const useReferralDetails = (userId: string) =>
  useQuery({
    queryFn: async () => {
      const response = await baseApi(`/referrals/details/${userId}`, {
        method: "GET",
        query: userId,
      });

      if (response.error) {
        throw new Error(response.error?.message);
      }
      console.log(response.data);
      return response.data;
    },
    queryKey: ["referral-details", userId],
  });
