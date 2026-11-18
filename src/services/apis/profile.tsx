import { createSchema } from '@better-fetch/fetch';

import { profileSchema, updateProfileSchema } from '../schema/profile';

export const profile = createSchema({
  '/profile': {
    method: 'get',
    output: profileSchema,
  },
  '@put/profile': {
    input: updateProfileSchema,
    method: 'put',
    output: profileSchema,
  },
});
