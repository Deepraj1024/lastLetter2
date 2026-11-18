import { createSchema } from '@better-fetch/fetch';

import { upiBodySchema } from '../schema/upi';

export const upi = createSchema({
  '/upis': {
    input: upiBodySchema,
    method: 'post',
    // output: upiResponseSchema,
  },
  '@get/upis': {
    method: 'get',
    // output: upiResponseSchema,
  },
  '@put/upis': {
    input: upiBodySchema,
    method: 'put',
    // output: upiResponseSchema,
  },
});
