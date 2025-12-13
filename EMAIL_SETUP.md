# Email Setup Guide (Resend)

## ✅ Free Tier Available!

**Resend offers 3,000 emails/month for FREE** - perfect for most contact forms!

## Quick Setup Steps

### 1. Create a Resend Account
1. Go to https://resend.com
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Give it a name (e.g., "Gospel Conference Contact Form")
4. Copy the API key (starts with `re_`)

### 3. Add API Key to Environment Variables
Add this to your `.env.local` file (or your hosting platform's environment variables):

```env
RESEND_API_KEY=re_your_api_key_here
```

### 4. (Optional) Verify Your Domain
To send FROM `hello@gospelconference.ca` instead of the default Resend domain:

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter `gospelconference.ca`
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)
6. Once verified, add to `.env.local`:
   ```env
   RESEND_FROM_EMAIL=hello@gospelconference.ca
   ```

**Note:** Until you verify your domain, emails will send FROM the Resend default domain (`onboarding@resend.dev`), but they will still send TO `hello@gospelconference.ca` and replies will work correctly.

## How It Works

- **Sends TO:** `hello@gospelconference.ca` ✅
- **Sends FROM:** Your verified domain (or Resend default until verified)
- **Reply-To:** `hello@gospelconference.ca` ✅ (replies work!)
- **Free Tier:** 3,000 emails/month

## Testing

1. Fill out the contact form on your website
2. Click "Send"
3. Check `hello@gospelconference.ca` inbox
4. Reply to test that replies work

## Pricing

- **Free:** 3,000 emails/month
- **Pro:** $20/month for 50,000 emails
- **Business:** Custom pricing

For a contact form, the free tier should be more than enough!

## Troubleshooting

### Emails not sending?
1. Check that `RESEND_API_KEY` is set in your environment variables
2. Check server logs for error messages
3. Verify your Resend account is active

### Want to use your own domain?
Follow step 4 above to verify `gospelconference.ca` domain in Resend.

## Security Note

Never commit your `RESEND_API_KEY` to git! Always use environment variables.

