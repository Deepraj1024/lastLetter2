import { z } from 'zod';

import { ltString, sBoolean, tString } from './common';

const loginBodySchemaType = z.object({
  email: z.email('Please enter a valid email address').trim().toLowerCase(),
  password: tString.min(1, 'Password is required'),
});

const loginBodySchema = z.object({
  email: ltString,
  fullName: ltString,
  id: ltString,
  kycStatus: tString,
  userStatus: ltString,
});

const loginResponseSchema = z.object({
  agent: z.object({
    email: ltString,
    fullName: ltString,
    id: ltString,
    kycStatus: tString,
    userStatus: ltString,
  }),
  message: ltString,
  refreshToken: z.jwt(),
  success: sBoolean,
  token: z.jwt(),
});

const refreshTokenBodySchema = z.object({
  refreshToken: z.jwt(),
});

const refreshTokenResponseSchema = z.object({
  message: ltString,
  refreshToken: z.jwt().optional(),
  success: sBoolean,
  token: z.jwt().optional(),
});

type LoginBodyType = z.infer<typeof loginBodySchemaType>;
type LoginBody = z.infer<typeof loginBodySchema>;
type LoginResponse = z.infer<typeof loginResponseSchema>;
type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
type RefreshTokenBody = z.infer<typeof refreshTokenBodySchema>;

export type {
  LoginBody,
  LoginBodyType,
  LoginResponse,
  RefreshTokenResponse,
  RefreshTokenBody,
};

export {
  loginBodySchema,
  loginBodySchemaType,
  loginResponseSchema,
  refreshTokenResponseSchema,
  refreshTokenBodySchema,
};
