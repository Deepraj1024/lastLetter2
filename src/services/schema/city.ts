import z from "zod";
import { responseSchema, sNumber, tString } from "./common";

const cityQuerySchema = z.object({
  count: sNumber.default(200),
  stateId: tString,
});

const citySchema = cityQuerySchema
  .omit({ count: true })
  .extend({ id: tString, name: tString });

const paginationSchema = z.object({
  count: z.number(),
  current_page: z.number(),
  hasMore: z.boolean(),
  per_page: z.number(),
});

const cityResponseSchema = responseSchema.extend({
  data: z.array(citySchema),
  pagination: paginationSchema,
});

type CityQuery = z.infer<typeof cityQuerySchema>;
type CityResponse = z.infer<typeof cityResponseSchema>;
type City = z.infer<typeof citySchema>;

export type { City, CityQuery, CityResponse };
export { cityQuerySchema, cityResponseSchema, citySchema };
