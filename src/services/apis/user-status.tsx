import { createSchema } from "@better-fetch/fetch";
import { userStatusSchema } from "../schema/user-status";

export const userStatus = createSchema({
  "/user-status": {
    method: "get",
    output: userStatusSchema,
  },
});
