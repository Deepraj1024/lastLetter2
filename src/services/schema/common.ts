import { z } from 'zod';

const tString = z.string().trim();
const ltString = tString.toLowerCase();
const utString = tString.toUpperCase();
const safeString = ltString.min(2);

const sNumber = z.coerce.number();
const sBoolean = z.coerce.boolean();
const sDate = z.coerce.date();

const responseSchema = z.object({
  success: sBoolean,
});

const augmontResponseSchema = z.object({
  message: tString,
  statusCode: sNumber,
});

const idSchema = z.object({
  id: tString,
});

const idNumSchema = z.object({
  id: sNumber,
});
const appGuideIdSchema = z.object({
  appGuideId: sNumber,
});

const MetalType = {
  GOLD: 'gold',
  SILVER: 'silver',
} as const;

const SUBSCRIPTION_TYPE = {
  INSTANT: 'instant',
  SIP: 'sip',
} as const;

const OS = {
  ANDROID: 'android',
  IOS: 'ios',
  SERVER_CRON: 'server_cron',
} as const;

const APP_VERSION_PLATFORM = {
  ANDROID: OS.ANDROID,
  IOS: OS.IOS,
} as const;

const appVersionPlatformSchema = z.enum(APP_VERSION_PLATFORM);

const STATUS = {
  FAILED: 'failed',
  PENDING: 'pending',
  REFUNDED: 'refunded',
  SUCCESS: 'success',
} as const;

const PAYMENT_MODE = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  NET_BANKING: 'NET_BANKING',
  UPI_COLLECT: 'UPI_COLLECT',
  UPI_INTENT: 'UPI_INTENT',
  WALLET: 'WALLET',
} as const;

const PAYMENT_FROM = {
  IDFC_FIRST_BANK: 'idfc_first_bank',
  PHONEPE: 'phonepe',
} as const;

const TRANSACTION_TYPE = {
  DAILY_SAVING: 'daily_saving',
  INSTANT_SAVING: 'instant_saving',
  MONTHLY_SAVING: 'monthly_saving',
  OTHER: 'other',
  REFUND: 'refund',
  SELL_METAL: 'sell_metal',
  TRANSFER: 'transfer',
  WEEKLY_SAVING: 'weekly_saving',
} as const;

const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

const metalTypeSchema = z.enum(MetalType).default(MetalType.GOLD);

const statusEnumSchema = z.enum(STATUS);

const paymentModeEnumSchema = z.enum(PAYMENT_MODE);

const subscriptionTypeEnumSchema = z
  .enum(SUBSCRIPTION_TYPE)
  .default(SUBSCRIPTION_TYPE.INSTANT);

const paymentFromEnumSchema = z.enum(PAYMENT_FROM);
// .default(PAYMENT_FROM.PHONEPE)

const transactionTypeEnumSchema = z.enum(TRANSACTION_TYPE);
// .default(TRANSACTION_TYPE.DAILY_SAVING)

const osEnumSchema = z.enum(OS).default(OS.ANDROID);

const sortDirectionEnumSchema = z
  .enum(SORT_DIRECTION)
  .default(SORT_DIRECTION.DESC);

type MetalTypeProp = z.infer<typeof metalTypeSchema>;
type SubscriptionTypeEnum = z.infer<typeof subscriptionTypeEnumSchema>;
type PaymentFromEnum = z.infer<typeof paymentFromEnumSchema>;
type PaymentModeEnum = z.infer<typeof paymentModeEnumSchema>;
type TransactionTypeEnum = z.infer<typeof transactionTypeEnumSchema>;
type OsEnum = z.infer<typeof osEnumSchema>;
type IdNum = z.infer<typeof idNumSchema>;
type Id = z.infer<typeof idSchema>;
type AppGuideId = z.infer<typeof appGuideIdSchema>;
type AppVersionPlatform = z.infer<typeof appVersionPlatformSchema>;
type StatusEnum = z.infer<typeof statusEnumSchema>;
type SortDirectionEnum = z.infer<typeof sortDirectionEnumSchema>;

export type {
  AppGuideId,
  Id,
  IdNum,
  MetalTypeProp,
  OsEnum,
  PaymentFromEnum,
  PaymentModeEnum,
  SortDirectionEnum,
  StatusEnum,
  SubscriptionTypeEnum,
  TransactionTypeEnum,
  AppVersionPlatform,
};

export {
  appGuideIdSchema,
  augmontResponseSchema,
  idNumSchema,
  idSchema,
  ltString,
  MetalType,
  metalTypeSchema,
  OS,
  osEnumSchema,
  PAYMENT_FROM,
  PAYMENT_MODE,
  paymentFromEnumSchema,
  paymentModeEnumSchema,
  appVersionPlatformSchema,
  responseSchema,
  SORT_DIRECTION,
  STATUS,
  SUBSCRIPTION_TYPE,
  safeString,
  sBoolean,
  sDate,
  sNumber,
  sortDirectionEnumSchema,
  statusEnumSchema,
  subscriptionTypeEnumSchema,
  TRANSACTION_TYPE,
  transactionTypeEnumSchema,
  APP_VERSION_PLATFORM,
  tString,
  utString,
};
