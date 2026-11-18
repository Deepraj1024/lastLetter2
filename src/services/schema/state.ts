import z from "zod";
import { responseSchema, tString } from "./common";

const stateSchema = z.object({ id: tString, name: tString });

const stateResponseSchema = responseSchema.extend({
  data: z.array(stateSchema),
});

type StateResponse = z.infer<typeof stateResponseSchema>;
type State = z.infer<typeof stateSchema>;

export type { State, StateResponse };
export { stateResponseSchema, stateSchema };
