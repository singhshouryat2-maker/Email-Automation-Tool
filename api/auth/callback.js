import {
  createFrontendRedirect,
  createOAuthClient,
  getUserEmail,
  hasConfiguredGmailCredentials,
} from '../_lib/googleAuth.js';
import { createSessionCookie } from '../_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!hasConfiguredGmailCredentials()) {
    return res.status(503).json({
      error:
        'Gmail OAuth is not configured yet. Add real GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET values in your Vercel project settings.'
    });
  }

  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'No authorization code' });
  }

  try {
    const oauth2Client = createOAuthClient(req);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userEmail = await getUserEmail(oauth2Client);
    res.setHeader(
      'Set-Cookie',
      createSessionCookie(
        {
          userEmail,
          tokens,
        },
        req
      )
    );
    return res.redirect(createFrontendRedirect(req, userEmail));
  } catch (error) {
    console.error('Vercel auth callback error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
