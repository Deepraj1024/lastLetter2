const TERMINAL_KYC_STATUSES: ReadonlySet<string> = new Set([
  'approved',
  'rejected',
  'failed',
]);

const POLL_INTERVAL_INITIAL_MS = 8000;
const POLL_INTERVAL_PENDING_MS = 12_000;

interface KycStatusData {
  kyc_status?: string;
  success?: boolean;
}

/**
 * Decides the next KYC-status poll delay (ms), or `false` to stop polling.
 *
 * Stop conditions:
 * - `success === false` — the request failed definitively (kid not found,
 *   under-age, etc.). Polling can never turn it into a result; the failure
 *   body carries the message to show the user.
 * - a terminal kyc_status (approved / rejected / failed).
 *
 * Anything else keeps polling: no data yet (initial), or an in-progress
 * status (approval_pending).
 */
export const getKycPollIntervalMs = (
  data: KycStatusData | undefined
): number | false => {
  if (data?.success === false) {
    return false;
  }

  const status = data?.kyc_status;
  if (status && TERMINAL_KYC_STATUSES.has(status)) {
    return false;
  }

  return status ? POLL_INTERVAL_PENDING_MS : POLL_INTERVAL_INITIAL_MS;
};
