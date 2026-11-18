import { createSchema } from '@better-fetch/fetch';

import {
  appVersionQuerySchema,
  appVersionResponseSchema,
} from '@/services/schema/app-version';

export const appVersion = createSchema({
  '/app-versions': {
    method: 'get',
    output: appVersionResponseSchema,
    query: appVersionQuerySchema,
  },
});
