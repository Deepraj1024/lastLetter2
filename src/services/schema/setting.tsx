import { z } from "zod";

const settingsSchema = z.object({
  data: z.array(
    z.object({ id: z.number(), key: z.string(), value: z.string() })
  ),
  success: z.boolean(),
});

type Settings = z.infer<typeof settingsSchema>;

export type { Settings };
export { settingsSchema };
