import { createSchema } from '@better-fetch/fetch';

import { fdReferrals } from '../schema/fd-referrals';
import { fdDetails } from '../schema/fd-referrals-details';
// import { fdDetails } from '../schema/fd-referrals-details';

export const fdReferral = createSchema({
  '/fd-referrals': {
    method: 'get',
    output: fdReferrals,
  },
  '/fd-referrals/details/{userId}': {
    method: 'get',
    output: fdDetails,
  },
});
