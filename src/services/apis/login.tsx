import { createSchema } from '@better-fetch/fetch';

import {
  loginBodySchemaType,
  loginResponseSchema,
  refreshTokenBodySchema,
  refreshTokenResponseSchema,
} from '../schema/login';

export const login = createSchema({
  '/login': {
    input: loginBodySchemaType,
    method: 'post',
    output: loginResponseSchema,
  },
  '/logout': {
    method: 'post',
  },
  '/refresh-token': {
    input: refreshTokenBodySchema,
    method: 'post',
    output: refreshTokenResponseSchema,
  },
});
