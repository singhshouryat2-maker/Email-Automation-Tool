require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || '';
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || '';
const GMAIL_REDIRECT_URI =
  process.env.GMAIL_REDIRECT_URI || 'http://localhost:3001/api/auth/callback';

function hasConfiguredEnvValue(value) {
  if (!value) {
    return false;
  }

  return !value.includes('your_') && !value.includes('google_cloud_console');
}

function hasConfiguredGmailCredentials() {
  return hasConfiguredEnvValue(GMAIL_CLIENT_ID) && hasConfiguredEnvValue(GMAIL_CLIENT_SECRET);
}

// Middleware
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));
app.use(express.json());

// In-memory token store (in production, use a database)
const tokenStore = new Map();

// OAuth2 Client Setup
const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI
);

// Generate OAuth URL
app.get('/api/auth/url', (req, res) => {
  if (!hasConfiguredGmailCredentials()) {
    return res.status(503).json({
      error:
        'Gmail OAuth is not configured yet. Replace the placeholder GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET values in server/.env with real Google Cloud credentials.'
    });
  }

  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ authUrl });
});

// OAuth Callback
app.get('/api/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'No authorization code' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user email
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });
    const userEmail = profile.data.emailAddress;

    // Store tokens (in production, save to database with userEmail as key)
    tokenStore.set(userEmail, tokens);

    // Redirect to frontend with success
    res.redirect(`${FRONTEND_ORIGIN}/?email=${encodeURIComponent(userEmail)}`);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Send Email
app.post('/api/email/send', async (req, res) => {
  const { userEmail, to, subject, body, scheduleTime } = req.body;

  if (!userEmail || !to || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const tokens = tokenStore.get(userEmail);
    if (!tokens) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    oauth2Client.setCredentials(tokens);

    // If scheduleTime is provided, schedule the email
    if (scheduleTime) {
      const delay = new Date(scheduleTime) - new Date();
      if (delay > 0) {
        setTimeout(() => sendEmailViaGmail(userEmail, to, subject, body, oauth2Client), delay);
        return res.json({ success: true, message: 'Email scheduled', scheduledFor: scheduleTime });
      }
    }

    // Send immediately
    const result = await sendEmailViaGmail(userEmail, to, subject, body, oauth2Client);
    res.json({ success: true, messageId: result });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Helper function to send email via Gmail API
async function sendEmailViaGmail(userEmail, to, subject, body, authClient) {
  const gmail = google.gmail({ version: 'v1', auth: authClient });

  const message = {
    raw: Buffer.from(
      `From: ${userEmail}\r\n` +
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `\r\n` +
      `${body}`
    ).toString('base64')
  };

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: message
  });

  return result.data.id;
}

// Get user emails (for filtering/preview)
app.get('/api/email/list', async (req, res) => {
  const { userEmail } = req.query;

  try {
    const tokens = tokenStore.get(userEmail);
    if (!tokens) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    oauth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const result = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10
    });

    const messages = await Promise.all(
      (result.data.messages || []).map(async (msg) => {
        const fullMessage = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });
        const headers = fullMessage.data.payload.headers;
        return {
          id: msg.id,
          from: headers.find(h => h.name === 'From')?.value || 'Unknown',
          subject: headers.find(h => h.name === 'Subject')?.value || '(no subject)',
          time: headers.find(h => h.name === 'Date')?.value || 'Unknown'
        };
      })
    );

    res.json({ emails: messages });
  } catch (error) {
    console.error('List emails error:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    gmailConfigured: hasConfiguredGmailCredentials()
  });
});

app.listen(PORT, () => {
  console.log(`\n📧 Email Automation Server running on http://localhost:${PORT}`);

  if (!hasConfiguredGmailCredentials()) {
    console.log(`\n⚠️  GMAIL OAUTH NOT CONFIGURED`);
    console.log(`\n1. Update server/.env with real values for:`);
    console.log(`   GMAIL_CLIENT_ID=<your_google_client_id>`);
    console.log(`   GMAIL_CLIENT_SECRET=<your_google_client_secret>`);
    console.log(`\n2. In Google Cloud Console, create an OAuth 2.0 Client ID as:`);
    console.log(`   - Application type: Web application`);
    console.log(`   - Authorized redirect URI: ${GMAIL_REDIRECT_URI}`);
    console.log(`\n3. Frontend: ${FRONTEND_ORIGIN}`);
  }
});
