# Email Automation Tool - Gmail API Setup

## Backend Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Get Gmail API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Gmail API:
   - Search for "Gmail API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Configure consent screen (fill in app name, etc)
   - For authorized redirect URIs, add: `http://localhost:3001/api/auth/callback`
5. Download credentials and copy:
   - Client ID
   - Client Secret

### 3. Create .env File
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REDIRECT_URI=http://localhost:3001/api/auth/callback
PORT=3001
```

### 4. Start the Server
```bash
npm run dev
# or
npm start
```

The server will run on `http://localhost:3001`

## Frontend Setup

The frontend automatically detects the backend. Just run:
```bash
npm run dev
```

Visit `http://localhost:5173`

## How to Use

1. **Login with Gmail**
   - Click the "Connect Gmail" button
   - You'll be redirected to Google login
   - Authorize the app to send emails
   - You'll be redirected back to the app

2. **Create a Workflow with Email**
   - Build a workflow with "Send Email" action
   - Set the recipient email
   - Add email subject and body
   - Set trigger time (immediate or scheduled)

3. **Schedule Emails**
   - In "Build new" → add "Send Email" step
   - Set a schedule time (e.g., 4:00 PM)
   - The email will be sent automatically at that time

## API Endpoints

- `GET /api/auth/url` - Get OAuth login URL
- `GET /api/auth/callback` - OAuth callback (handled by Google)
- `POST /api/email/send` - Send an email
- `GET /api/health` - Health check

The OAuth flow is configured for send-only Gmail access to keep verification
requirements simpler than inbox-reading access.

## Security Notes

⚠️ **Important for Production:**
- Never commit `.env` file to git
- Use HTTPS instead of HTTP
- Store tokens securely (database, encrypted)
- Validate all inputs server-side
- Implement rate limiting
- Use refresh tokens for long-lived sessions
