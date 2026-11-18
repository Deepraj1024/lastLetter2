import { z } from 'zod';

import { sBoolean, tString } from './common';

const registerBodySchema = z.object({
  email: z.email('Invalid email address').toLowerCase(),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(20, 'Full name must be at most 20 characters')
    .regex(/^[a-zA-Z ]+$/u, 'Only alphabets and spaces allowed')
    .toLowerCase(),
  mobileNumber: tString.min(10, 'Mobile number must be at least 10 digits'),
  password: tString
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must be at most 20 characters'),
});

const registerResponseSchema = z.object({
  agentId: tString,
  message: tString,
  refferalCode: tString,
  success: sBoolean,
  token: tString,
});

type RegisterBody = z.infer<typeof registerBodySchema>;
type RegisterResponse = z.infer<typeof registerResponseSchema>;

export type { RegisterBody, RegisterResponse };
export { registerBodySchema, registerResponseSchema };
