import { createFetch, createSchema } from '@better-fetch/fetch';

import { isPublicAuthRequest } from '@/utils/auth-endpoints';
import { getToken } from '@/utils/storage';

import { aadhar } from './aadhar';
import { appVersion } from './app-verison';
import { commissionCalculator } from './commission-calculator';
import { conversation } from './conversation';
import { deleteUser } from './delete-user';
import { emailPhone } from './email';
import { fdReferral } from './fd-referrals';
import { forgetPassword } from './forget-password';
import { login } from './login';
import { panCard } from './panCard';
import { profile } from './profile';
import { recentTransaction } from './recent-transaction';
import { referralDetail } from './referral-details';
import { referralsUser } from './referral-user';
import { referrals } from './referrals';
import { isUnauthorizedStatus, refreshSession } from './refresh-session';
import { register } from './register';
import { rewards } from './rewards';
import { setting } from './setting';
import { upi } from './upi';
import { userStatus } from './user-status';
import { wallet } from './wallet';
import { withdrawl } from './withdrawl';

const apiSchema = createSchema({
  ...register.schema,
  ...emailPhone.schema,
  ...userStatus.schema,
  ...panCard.schema,
  ...aadhar.schema,
  ...login.schema,
  ...profile.schema,
  ...commissionCalculator.schema,
  ...upi.schema,
  ...referrals.schema,
  ...referralsUser.schema,
  ...referralDetail.schema,
  ...recentTransaction.schema,
  ...wallet.schema,
  ...withdrawl.schema,
  ...setting.schema,
  ...conversation.schema,
  ...rewards.schema,
  ...forgetPassword.schema,
  ...deleteUser.schema,
  ...appVersion.schema,
  ...fdReferral.schema,
});

const AUTH_REFRESH_RETRY_ATTEMPTS = 1;
const AUTH_REFRESH_RETRY_DELAY_MS = 0;

const baseApi = createFetch({
  auth: {
    token: () => getToken() || '',
    type: 'Bearer',
  },
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
  retry: {
    attempts: AUTH_REFRESH_RETRY_ATTEMPTS,
    delay: AUTH_REFRESH_RETRY_DELAY_MS,
    shouldRetry: async (response) => {
      if (!response || !isUnauthorizedStatus(response.status)) {
        return false;
      }

      if (isPublicAuthRequest(response.url)) {
        return false;
      }

      return await refreshSession();
    },
    type: 'linear',
  },
  schema: apiSchema,
});

export { baseApi };
