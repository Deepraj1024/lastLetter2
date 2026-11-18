import { createSchema } from '@better-fetch/fetch';

import { panCardResponseSchema, panCardSchema } from '../schema/panCard';

export const panCard = createSchema({
  '/kyc': {
    input: panCardSchema,
    method: 'post',
    output: panCardResponseSchema,
  },
});
