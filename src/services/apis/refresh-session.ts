import { createSingleFlight } from '@/utils/single-flight';
import { getRefreshToken, setRefreshToken, setToken } from '@/utils/storage';

import { refreshTokenResponseSchema } from '../schema/login';
import { handleUnauthorized } from './unauthorized';

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
const REFRESH_ENDPOINT = '/refresh-token';
const HTTP_UNAUTHORIZED = 401;

const requestNewTokens = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken();
  if (!BASE_URL || !refreshToken) {
    return false;
  }

  const response = await fetch(`${BASE_URL}${REFRESH_ENDPOINT}`, {
    body: JSON.stringify({ refreshToken }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    return false;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  const parsed = refreshTokenResponseSchema.safeParse(payload);

  if (!parsed.success || !parsed.data.token) {
    return false;
  }

  setToken(parsed.data.token);
  if (parsed.data.refreshToken) {
    setRefreshToken(parsed.data.refreshToken);
  }

  return true;
};

const runRefresh = createSingleFlight(requestNewTokens);

export const refreshSession = async (): Promise<boolean> => {
  const didRefresh = await runRefresh().catch((error) => {
    console.error('[refresh-session] failed:', error);
    return false;
  });

  if (!didRefresh) {
    handleUnauthorized();
  }

  return didRefresh;
};

export const isUnauthorizedStatus = (status: number): boolean =>
  status === HTTP_UNAUTHORIZED;
