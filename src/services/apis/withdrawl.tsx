import { createSchema } from '@better-fetch/fetch';
import z from 'zod';

import { withdrawlDetailSchema, withdrawlSchema } from '../schema/withdrawl';

export const withdrawl = createSchema({
  '/withdrawl': {
    method: 'get',
    output: withdrawlSchema,
  },
  '@get/withdrawl': {
    method: 'get',
    output: withdrawlDetailSchema,
    params: z.object({
      id: z.number(),
    }),
  },
});
