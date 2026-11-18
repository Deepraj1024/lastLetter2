import { createSchema } from '@better-fetch/fetch';
import z from 'zod';

import { aadharBodySchema, aadharResponseSchema } from '../schema/aadhar';

export const aadhar = createSchema({
  '/kyc/start': {
    input: aadharBodySchema,
    method: 'post',
    output: aadharResponseSchema,
  },
  '/kyc/status': {
    method: 'get',
    // output: aadharStatusSchema,
    query: z.object({
      kid: z.string(),
    }),
  },
});
