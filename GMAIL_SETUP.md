# 📧 Gmail API Setup Guide

## Quick Start

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Get Gmail API Credentials (5 minutes)

#### Step 1: Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Sign in with your Google account
3. Create a **New Project** (top left, click the dropdown)
   - Name: "Email Automation Tool"
   - Click **Create**

#### Step 2: Enable Gmail API
1. Search for **"Gmail API"** in the search bar at top
2. Click **Gmail API** from results
3. Click the blue **ENABLE** button
4. Wait for it to activate (takes 10-30 seconds)

#### Step 3: Create OAuth Credentials
1. Click **Credentials** (left sidebar)
2. Click **+ CREATE CREDENTIALS** button
3. Select **OAuth 2.0 Client ID**
4. If prompted, click **CONFIGURE CONSENT SCREEN**
   - Choose **External**
   - Fill in:
     - **App name**: "Email Automation Tool"
     - **User support email**: your@email.com
     - **Developer contact email**: your@email.com
   - Click **SAVE AND CONTINUE** twice
   - Don't add scopes, just click **SAVE AND CONTINUE** again
   - Click **BACK TO DASHBOARD**

5. Click **+ CREATE CREDENTIALS** again → **OAuth 2.0 Client ID**
6. Select **Web application**
7. Add this **Authorized redirect URI**:
   - `http://localhost:3001/api/auth/callback`
8. Click **CREATE**

#### Step 4: Copy Your Credentials
1. Click on the OAuth 2.0 Client ID you just created
2. Copy:
   - **Client ID** (long string like `123...apps.googleusercontent.com`)
   - **Client Secret** (long string)

### 3. Configure .env File
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
GMAIL_CLIENT_ID=your_client_id_from_above
GMAIL_CLIENT_SECRET=your_client_secret_from_above
GMAIL_REDIRECT_URI=http://localhost:3001/api/auth/callback
PORT=3001
NODE_ENV=development
```

### 4. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
Should see: `📧 Email Automation Server running on http://localhost:3001`

**Terminal 2 (Frontend):**
```bash
npm run dev
```
Should see: `➜  Local:   http://localhost:5173/`

### 5. Test It!

1. Visit http://localhost:5173/
2. Click **"Connect Gmail"** button (top right)
3. Sign in with your Google account
4. Click **Allow** when asked for permissions
5. You'll be redirected back - you should see your email displayed!

---

## How to Use Email Workflows

### Create a Workflow that Sends Emails

1. Go to **"Build new"** tab
2. Set up your filter:
   - **Filter**: Use Gmail query syntax
   - Examples:
     - `from:boss@company.com` - emails from boss
     - `subject:(urgent OR ASAP)` - urgent emails
     - `from:(@gmail.com OR @yahoo.com)` - personal emails

3. Add a **"Send Email"** step:
   - **Recipient**: recipient@example.com
   - **Subject**: "Auto-reply: Your message received"
   - **Body**: Write your message
   - **Send time**: Leave empty to send immediately, or set a specific time

4. Click **Create Workflow**

5. Once created, click **"Run"** to execute (if enabled)

### Schedule Emails for Later

When adding a "Send Email" step:
- Leave **Send time** empty = Sends immediately
- Click on the time field to pick a datetime:
  - Time = "4:00 PM today"
  - Or "Tomorrow at 10:00 AM"
  - Email will be queued and sent at that time

---

## Troubleshooting

### "Failed to connect Gmail" error
- Make sure backend is running on `http://localhost:3001`
- Check that `.env` file has correct credentials
- Make sure `GMAIL_CLIENT_ID` is your real Google client ID, not the placeholder example value
- Try: `npm run dev` in the server folder

### OAuth login redirects to blank page
- This is normal! The page might be blank but check localhost:5173 in another tab
- Make sure redirect URI in Google Cloud is: `http://localhost:3001/api/auth/callback`

### Emails not sending
- Check that you're logged in (email shown in top right)
- Make sure recipient email is valid
- Check browser console (F12) for any error messages

### Cannot create credentials  
- Make sure Gmail API is **ENABLED** (blue toggle in Google Cloud)
- Make sure you selected **Web application** as app type
- Make sure authorized redirect URI includes `http://localhost:3001/api/auth/callback`

---

## What's Happening Behind the Scenes

```
User clicks "Connect Gmail"
  ↓
Frontend → Backend requests OAuth URL
  ↓
Backend → Google's servers
  ↓
User sees Google login screen
  ↓
User authorizes app
  ↓
Google → Backend with auth code
  ↓
Backend exchanges code for access token
  ↓
Backend stores token securely
  ↓
User logs in! ✓
  ↓
User creates workflow with "Send Email"
  ↓
When triggered, backend uses Gmail API to send real email
  ↓
Email appears in recipient's inbox!
```

---

## Security Notes

⚠️ **For Production:**
- Use HTTPS instead of HTTP
- Store tokens in a database (encrypted)
- Implement rate limiting
- Add user authentication
- Never commit `.env` files
- Use refresh tokens for long sessions
- Validate all inputs server-side

## Questions?

If something doesn't work:
1. Check the console (F12) for red errors
2. Check server terminal for error messages
3. Make sure all three ports are correct:
   - Frontend: 5173
   - Backend: 3001
   - Google OAuth callback: localhost:3001/api/auth/callback
