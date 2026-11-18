const PUBLIC_AUTH_ENDPOINTS = [
  '/login',
  '/register',
  '/refresh-token',
  '/forgot-password/send-otp',
  '/forgot-password/verify-otp',
  '/reset-password',
  '/register/email/send-otp',
  '/register/email/verify-otp',
  '/register/phone/send-otp',
  '/register/phone/verify-otp',
] as const;

/**
 * Requests to these endpoints authenticate the session themselves. A 401
 * here means bad credentials or an already-dead session — it must never
 * trigger a token refresh (and must never log out: there is no session yet).
 */
export const isPublicAuthRequest = (requestUrl: string): boolean =>
  PUBLIC_AUTH_ENDPOINTS.some((endpoint) => requestUrl.includes(endpoint));
