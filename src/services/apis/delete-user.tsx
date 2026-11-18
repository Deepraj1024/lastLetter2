import { createSchema } from "@better-fetch/fetch";

export const deleteUser = createSchema({
  "/delete-user": {
    method: "post",
  },
});
