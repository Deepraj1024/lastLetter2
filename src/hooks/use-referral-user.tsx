import { useQuery } from "@tanstack/react-query";
import { baseApi } from "@/services/apis";
import {
  type ReferralParamsSchema,
  type ReferralsUserSchema,
  referralsUserSchema,
} from "@/services/schema/referrals-user";

export const useReferralUser = (params: ReferralParamsSchema) =>
  useQuery<ReferralsUserSchema>({
    queryFn: async () => {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              acc[key] = String(value);
            }

            return acc;
          },
          {} as Record<string, string>
        )
      ).toString();

      const endpoint = `/referrals${queryString ? `?${queryString}` : ""}`;

      console.log("🚀 GET", endpoint);

      const response = await baseApi(endpoint, {
        method: "GET",
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return referralsUserSchema.parse(response.data);
    },
    queryKey: [
      "referral-users",
      params.search,
      params.status,
      params.sortBy,
      params.sortorder,
    ],
  });
