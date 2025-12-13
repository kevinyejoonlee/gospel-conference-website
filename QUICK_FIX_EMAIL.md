# Quick Fix: Make Email Work

## Step 1: Add hello@gospelconference.ca as Test Recipient in Resend

1. Go to https://resend.com
2. Sign in to your account
3. Go to **Settings** → **API Keys** or **Domains**
4. Look for **"Test Emails"** or **"Allowed Recipients"** section
5. Click **"Add Test Email"** or **"Add Recipient"**
6. Enter: `hello@gospelconference.ca`
7. Click **Save**

## Step 2: Restart Your Server

After adding the test email:
1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Try the contact form - it should work!

## Alternative: Use Your Personal Email for Testing

If you can't find the test email option, add this to `.env.local`:

```env
RESEND_TEST_EMAIL=your-email@gmail.com
```

Then restart your server. Emails will go to your email instead.

---

## About reCAPTCHA

**You DON'T need an email for reCAPTCHA!** You just need:

1. A Google account (Gmail, Google Workspace, etc.)
2. Go to https://www.google.com/recaptcha/admin/create
3. Sign in with your Google account
4. Get the keys (no email verification needed)

The form will work WITHOUT reCAPTCHA keys (it just won't have bot protection). You can add them later.

