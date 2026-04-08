import { google } from 'googleapis';
import { createOAuthClient } from '../_lib/googleAuth.js';
import {
  createSessionCookie,
  mergeSessionTokens,
  readSession,
} from '../_lib/session.js';

function toGmailRaw(message) {
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function readJsonBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body);
  }

  return req.body;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = readSession(req);
  if (!session?.userEmail || !session?.tokens) {
    return res.status(401).json({ error: 'Please connect Gmail before sending an email.' });
  }

  const { userEmail, to, subject, body, scheduleTime } = readJsonBody(req);
  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (userEmail && userEmail !== session.userEmail) {
    return res.status(403).json({ error: 'Authenticated user does not match the email sender.' });
  }

  if (scheduleTime && new Date(scheduleTime) > new Date()) {
    return res.status(400).json({
      error: 'Scheduled sends are not supported in the deployed app yet. Send the email immediately instead.',
    });
  }

  try {
    const oauth2Client = createOAuthClient(req);
    oauth2Client.setCredentials(session.tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: toGmailRaw(
          `From: ${session.userEmail}\r\n` +
            `To: ${to}\r\n` +
            `Subject: ${subject}\r\n` +
            `\r\n` +
            `${body}`
        ),
      },
    });

    res.setHeader(
      'Set-Cookie',
      createSessionCookie(
        {
          ...session,
          tokens: mergeSessionTokens(session.tokens, oauth2Client.credentials),
        },
        req
      )
    );

    return res.status(200).json({
      success: true,
      messageId: result.data.id,
      from: session.userEmail,
    });
  } catch (error) {
    console.error('Vercel send email error:', error);
    return res.status(500).json({ error: 'Failed to send email.' });
  }
}
