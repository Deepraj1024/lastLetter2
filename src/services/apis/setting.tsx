import { createSchema } from "@better-fetch/fetch";
import { settingsSchema } from "../schema/setting";

export const setting = createSchema({
  "/settings": {
    method: "get",
    output: settingsSchema,
  },
});
