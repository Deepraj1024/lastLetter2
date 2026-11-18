import { createSchema } from "@better-fetch/fetch";
import z from "zod";

export const conversation = createSchema({
  "/conversation": {
    method: "post",
  },
  "/conversation/categories": {
    method: "get",
  },
  "/conversation/categories/questions": {
    method: "get",
    query: z.object({
      category: z.string(),
    }),
  },
  "/conversation/suggestion": {
    method: "post",
  },
});
