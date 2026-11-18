import { createSchema } from "@better-fetch/fetch";
import { registerBodySchema, registerResponseSchema } from "../schema/register";

export const register = createSchema({
  "/register": {
    input: registerBodySchema,
    method: "post",
    output: registerResponseSchema,
  },
});
