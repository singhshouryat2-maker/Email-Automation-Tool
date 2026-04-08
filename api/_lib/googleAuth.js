import { google } from 'googleapis';

function hasConfiguredEnvValue(value) {
  if (!value) {
    return false;
  }

  return !value.includes('your_') && !value.includes('google_cloud_console');
}

export function hasConfiguredGmailCredentials() {
  return (
    hasConfiguredEnvValue(process.env.GMAIL_CLIENT_ID) &&
    hasConfiguredEnvValue(process.env.GMAIL_CLIENT_SECRET)
  );
}

export function getRequestOrigin(req) {
  const forwardedProtoHeader = req.headers['x-forwarded-proto'];
  const forwardedHostHeader = req.headers['x-forwarded-host'];
  const hostHeader = forwardedHostHeader || req.headers.host;

  const forwardedProto = Array.isArray(forwardedProtoHeader)
    ? forwardedProtoHeader[0]
    : forwardedProtoHeader;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  const protocol = forwardedProto || (host?.includes('localhost') ? 'http' : 'https');

  return `${protocol}://${host}`;
}

export function getRedirectUri(req) {
  return process.env.GMAIL_REDIRECT_URI || `${getRequestOrigin(req)}/api/auth/callback`;
}

export function createOAuthClient(req) {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    getRedirectUri(req)
  );
}

export async function getUserEmail(oauth2Client) {
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const profile = await oauth2.userinfo.get();
  return profile.data.email;
}

export function createFrontendRedirect(req, userEmail) {
  const origin = process.env.FRONTEND_ORIGIN || getRequestOrigin(req);
  const url = new URL('/', origin);
  url.searchParams.set('email', userEmail);
  return url.toString();
}
