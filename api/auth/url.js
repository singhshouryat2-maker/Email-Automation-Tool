import { createOAuthClient, hasConfiguredGmailCredentials } from '../_lib/googleAuth.js';

export default function handler(req, res) {
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

  const oauth2Client = createOAuthClient(req);
  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });

  return res.status(200).json({ authUrl });
}
