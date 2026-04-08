import crypto from 'crypto';

const COOKIE_NAME = 'email_automation_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getCookieSecret() {
  const secret = process.env.SESSION_SECRET || process.env.GMAIL_CLIENT_SECRET;

  if (!secret) {
    throw new Error('Missing SESSION_SECRET or GMAIL_CLIENT_SECRET for session encryption.');
  }

  return crypto.createHash('sha256').update(secret).digest();
}

function isSecureRequest(req) {
  const forwardedProtoHeader = req.headers['x-forwarded-proto'];
  const hostHeader = req.headers['x-forwarded-host'] || req.headers.host;

  const forwardedProto = Array.isArray(forwardedProtoHeader)
    ? forwardedProtoHeader[0]
    : forwardedProtoHeader;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;

  if (forwardedProto) {
    return forwardedProto === 'https';
  }

  return !host?.includes('localhost');
}

function toBase64Url(value) {
  return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4;

  if (!padding) {
    return normalized;
  }

  return normalized + '='.repeat(4 - padding);
}

function encryptSession(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getCookieSecret(), iv);
  const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted]
    .map((buffer) => toBase64Url(buffer.toString('base64')))
    .join('.');
}

function decryptSession(value) {
  const [ivPart, tagPart, encryptedPart] = value.split('.');
  if (!ivPart || !tagPart || !encryptedPart) {
    throw new Error('Invalid session payload.');
  }

  const iv = Buffer.from(fromBase64Url(ivPart), 'base64');
  const tag = Buffer.from(fromBase64Url(tagPart), 'base64');
  const encrypted = Buffer.from(fromBase64Url(encryptedPart), 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', getCookieSecret(), iv);

  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

function serializeCookie(value, req, maxAgeSeconds) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (isSecureRequest(req)) {
    parts.push('Secure');
  }

  return parts.join('; ');
}

function parseCookies(req) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return {};
  }

  return Object.fromEntries(
    cookieHeader.split(';').map((part) => {
      const [rawKey, ...rest] = part.trim().split('=');
      return [rawKey, decodeURIComponent(rest.join('='))];
    })
  );
}

export function createSessionCookie(session, req) {
  const payload = encryptSession(JSON.stringify(session));
  return serializeCookie(payload, req, SESSION_MAX_AGE_SECONDS);
}

export function clearSessionCookie(req) {
  return serializeCookie('', req, 0);
}

export function readSession(req) {
  const cookies = parseCookies(req);
  const value = cookies[COOKIE_NAME];

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(decryptSession(value));
  } catch (error) {
    return null;
  }
}

export function mergeSessionTokens(previousTokens, nextTokens) {
  return {
    ...previousTokens,
    ...nextTokens,
    refresh_token: nextTokens.refresh_token || previousTokens.refresh_token,
  };
}
