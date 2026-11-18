import { z } from 'zod';

import {
  appVersionPlatformSchema,
  responseSchema,
  sNumber,
  tString,
} from './common';

const appVersionQuerySchema = z.object({
  bundleId: tString,
  platform: appVersionPlatformSchema,
});

const appVersionDataSchema = z.object({
  appStoreUrl: tString,
  bundleId: tString,
  changeLog: tString?.nullish(),
  platform: appVersionPlatformSchema,
  version: tString,
  versionCode: sNumber.int().positive(),
});

const appVersionResponseSchema = responseSchema.extend({
  data: appVersionDataSchema,
});

type AppVersionQuery = z.infer<typeof appVersionQuerySchema>;
type AppVersion = z.infer<typeof appVersionDataSchema>;

export type { AppVersion, AppVersionQuery };
export { appVersionQuerySchema, appVersionResponseSchema };
