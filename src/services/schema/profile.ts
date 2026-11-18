import { z } from 'zod';

import { ltString, sBoolean, sDate, tString } from './common';

const updateProfileSchema = z.object({
  address: tString,
  city: tString,
  pincode: tString,
  state: tString,
});

const profileSchema = z.object({
  agent: z.object({
    aadhaarNumber: tString.nullable(),
    aadhaarVerified: sBoolean.default(false),
    address: tString.nullable(),
    city: tString,
    createdAt: sDate,
    dateOfBirth: tString.nullable(),
    email: z.email().toLowerCase(),
    fatherName: tString.nullable(),
    fullName: ltString,
    gender: tString.nullable(),
    id: tString,
    ifscCode: tString.nullable(),
    imageUrl: tString.nullable(),
    isWhatsapp: sBoolean.default(false),
    kycStatus: tString,
    mobileNumber: tString,
    panNumber: tString.nullable(),
    panVerified: sBoolean.default(false),
    pincode: tString,
    refferalCode: tString,
    selfieVerified: sBoolean.default(false),
    state: tString,
    userStatus: tString,
  }),
  message: tString.nullable(),
  success: sBoolean.default(false),
});

const profileUpdateSchema = profileSchema.omit({ kyc: true });
type Profile = z.infer<typeof profileSchema>;
type UpdateProfile = z.infer<typeof profileUpdateSchema>;

export type { Profile, UpdateProfile };

export { profileSchema, profileUpdateSchema, updateProfileSchema };
