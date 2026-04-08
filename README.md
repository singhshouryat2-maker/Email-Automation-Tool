# Email Automation Tool

A full-stack React + Node.js email automation workflow builder with **real Gmail API integration** for sending emails.

## ✨ Features

- ✅ **Build Custom Workflows** - Create email automation rules with visual builder
- ✅ **Gmail Integration** - Send real emails via Gmail API  
- ✅ **OAuth Authentication** - Secure login with Google Account
- ✅ **Email Scheduling** - Send emails at specific times (4 PM, tomorrow, etc.)
- ✅ **Workflow Management** - Create, run, pause, and monitor automations
- ✅ **Real-time Stats** - See emails processed, success rates, last run time

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google account (for Gmail API)

### Setup

**1. Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

**2. Get Gmail API Credentials** (See [GMAIL_SETUP.md](./GMAIL_SETUP.md) for detailed steps)
```bash
# Create .env file in server/
cp server/.env.example server/.env

# Add your credentials:
GMAIL_CLIENT_ID=your_id_from_google_cloud
GMAIL_CLIENT_SECRET=your_secret_from_google_cloud
GMAIL_REDIRECT_URI=http://localhost:3001/api/auth/callback
```

Create the Google OAuth client as a **Web application** and add
`http://localhost:3001/api/auth/callback` as an authorized redirect URI.

**3. Start Both Servers**

Terminal 1 (Backend):
```bash
cd server
npm run dev
# Output: 📧 Email Automation Server running on http://localhost:3001
```

Terminal 2 (Frontend):
```bash
npm run dev
# Output: ➜  Local:   http://localhost:5173/
```

**4. Open in Browser**
Visit `http://localhost:5173` and click **"Connect Gmail"**

## 📖 Usage

### 1. Connect Your Gmail
- Click **"Connect Gmail"** button (top right)
- Sign in with Google
- Authorize the app
- Your email will display when authenticated

### 2. Create a Workflow
Go to **"Build new"** tab and:
- Set a **Name** (e.g., "Auto-reply to boss")
- Set a **Trigger** (new email, scheduled time, manual)
- Write a **Filter** using Gmail query syntax:
  ```
  from:boss@company.com          # From specific sender
  subject:(urgent OR ASAP)        # Match keywords in subject
  from:(@gmail.com OR @yahoo.com) # From personal email domains
  ```
- Add **Workflow Steps** (label, send email, forward, etc.)

### 3. Send Emails
- Add a **"Send Email"** step
- Set recipient, subject, and body
- Optional: Set send time (e.g., 4:00 PM) for scheduling
- Click **Create Workflow**

### 4. Run & Monitor
- Go to **"Overview"** tab
- Click **"Run"** button to execute workflow
- Watch emails get processed in real-time
- Stats update automatically

## 🏗️ Project Structure

```
├── src/
│   ├── EmailAutomationTool.tsx   # React component (UI)
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Styles
├── server/
│   ├── server.js                 # Node.js/Express backend
│   ├── package.json              # Backend dependencies
│   └── .env                       # Gmail API credentials (create this)
├── GMAIL_SETUP.md                # Detailed Gmail API setup guide
├── package.json                  # Frontend dependencies
└── vite.config.ts               # Frontend build config
```

## 🔑 Technologies

**Frontend:**
- React 18
- TypeScript
- Vite
- Framer Motion (animations)
- Lucide React (icons)

**Backend:**
- Node.js 18+
- Express.js
- Gmail API (google-auth-oauth2)
- CORS, dotenv

## 🔐 Gmail API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/auth/url` | Get OAuth login URL |
| GET | `/api/auth/callback` | OAuth callback (automatic) |
| POST | `/api/email/send` | Send an email |
| GET | `/api/email/list` | List user's emails |
| GET | `/api/health` | Server status check |

## 📧 Send Email API

```javascript
POST /api/email/send
Content-Type: application/json

{
  "userEmail": "user@gmail.com",
  "to": "recipient@example.com",
  "subject": "Your subject",
  "body": "Email content",
  "scheduleTime": "2024-04-08T16:00:00" // Optional
}
```

## 🚨 Troubleshooting

**"Failed to connect Gmail"**
- Ensure backend is running on `http://localhost:3001`
- Check credentials in `server/.env`
- Restart both servers

**OAuth redirects to blank page**
- Normal behavior - check `http://localhost:5173` in another tab
- Verify Google Cloud has correct redirect URI

**Emails not sending**
- Confirm you're logged in (email shown in header)
- Check console (F12) for errors
- Verify recipient email is valid

See [GMAIL_SETUP.md](./GMAIL_SETUP.md) for more troubleshooting.

## 🔒 Security

⚠️ **Important for Production:**
- Use HTTPS instead of HTTP
- Store tokens securely (database with encryption)
- Implement rate limiting
- Add user session management
- Never commit `.env` files to git
- Use refresh tokens for long-lived sessions
- Validate all inputs server-side

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

---

**Need Help?** See [GMAIL_SETUP.md](./GMAIL_SETUP.md) for the complete setup guide with screenshots!
