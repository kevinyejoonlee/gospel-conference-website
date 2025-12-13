# Testing Email on Localhost

## The Issue

Resend's default domain only allows sending to **verified/test emails**. You can't send to `hello@gospelconference.ca` on localhost unless it's added as a test recipient.

## Solution: Two Options

### Option 1: Add Test Email to Resend (Recommended)

1. Go to https://resend.com/emails
2. Click on your account settings
3. Find "Test Emails" or "Allowed Recipients" 
4. Add `hello@gospelconference.ca` as a test recipient
5. Restart your dev server
6. It will work!

### Option 2: Use Your Personal Email for Testing

1. Open `.env.local` file
2. Add this line:
   ```env
   RESEND_TEST_EMAIL=your-email@gmail.com
   ```
   (Replace with your actual email)
3. Restart your dev server
4. Emails will be sent to your email instead of hello@gospelconference.ca
5. When ready for production, remove this line or add hello@gospelconference.ca as test recipient

## Example .env.local

```env
# Resend Email API Key
RESEND_API_KEY=re_KRteZp9J_25LVJkn5ocdRhRZ9pxVnV371

# For localhost testing - use your email
RESEND_TEST_EMAIL=your-email@gmail.com

# For production - remove RESEND_TEST_EMAIL and add hello@gospelconference.ca as test recipient in Resend
```

## After Testing

Once you're ready for production:
1. Add `hello@gospelconference.ca` as a test recipient in Resend dashboard
2. Remove `RESEND_TEST_EMAIL` from `.env.local` (or leave it, it will use hello@gospelconference.ca by default)
3. Restart server
4. Done!

