import { z } from 'zod';

import { sBoolean, tString } from './common';

const upiBodySchema = z.object({
  is_primary: sBoolean,
  upi_id: tString,
});

const upiUpdateParamsSchema = z.object({
  id: z.string(),
});

const upiResponseSchema = z.object({
  data: z.object({
    agentId: z.string(),
    createdAt: z.string(),
    deletedAt: z.null(),
    id: z.number(),
    is_primary: z.boolean(),
    updatedAt: z.string(),
    upi_id: z.string(),
  }),
  status: z.number(),
  success: z.boolean(),
});
type UpiResponse = z.infer<typeof upiResponseSchema>;
type UpiBody = z.infer<typeof upiBodySchema>;

type UpiUpdateParams = z.infer<typeof upiUpdateParamsSchema>;

export type { UpiBody, UpiResponse, UpiUpdateParams };
export { upiBodySchema, upiResponseSchema, upiUpdateParamsSchema };
