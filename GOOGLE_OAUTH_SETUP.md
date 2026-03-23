# Google OAuth Setup Guide

## Step 1 — Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Click **"Select a project"** → **"New Project"**
4. Name it `auth-saas`
5. Click **Create**

---

## Step 2 — Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** → click **Create**
3. Fill in the following:

| Field | Value |
|---|---|
| App name | `auth-saas` |
| User support email | your email |
| Developer contact email | your email |

4. Click **Save and Continue** through all remaining steps

---

## Step 3 — Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Select **Web application**
4. Under **Authorized redirect URIs** add:

```
http://localhost:8000/auth/google/callback
```

5. Click **Create**

---

## Step 4 — Copy Your Credentials

You will get two values — copy both:

```
Client ID     → GOOGLE_CLIENT_ID
Client Secret → GOOGLE_CLIENT_SECRET
```

---

## Step 5 — Add to your .env file

Open `backend/.env` and add:

```bash
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## How Google OAuth works

```
User clicks "Continue with Google"
        ↓
Frontend calls GET /auth/google/login
        ↓
Backend returns Google auth URL
        ↓
User is redirected to Google login page
        ↓
User approves → Google sends a "code" to:
http://localhost:8000/auth/google/callback
        ↓
Backend exchanges "code" for user info
        ↓
Backend creates JWT token
        ↓
User redirected to frontend with token
```
