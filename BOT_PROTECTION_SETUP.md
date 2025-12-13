# Bot Protection Setup Guide

## ✅ Protection Features Added

Your contact form now has **3 layers of bot protection**:

1. **Rate Limiting**: Max 3 submissions per minute per IP address
2. **reCAPTCHA v3**: Invisible Google verification (no annoying puzzles!)
3. **Honeypot Field**: Hidden field that catches bots automatically

## reCAPTCHA v3 Setup (FREE)

reCAPTCHA v3 is **completely free** and invisible to users!

### 1. Get reCAPTCHA Keys

1. Go to https://www.google.com/recaptcha/admin/create
2. Sign in with your Google account
3. Fill out the form:
   - **Label**: Gospel Conference Contact Form
   - **reCAPTCHA type**: Select **reCAPTCHA v3**
   - **Domains**: Add your domain (e.g., `gospelconference.ca`, `www.gospelconference.ca`)
   - Accept the terms
4. Click **Submit**
5. Copy your **Site Key** and **Secret Key**

### 2. Add Keys to Environment Variables

Add these to your `.env.local` file (or your hosting platform's environment variables):

```env
# reCAPTCHA v3 Keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

**Important:**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Used in the frontend (public)
- `RECAPTCHA_SECRET_KEY` - Used in the backend (keep secret!)

### 3. Test It

1. Fill out the contact form
2. Submit it
3. Check that emails are sent successfully
4. Try submitting 4+ times quickly - you should get rate limited

## How It Works

### Rate Limiting
- **Limit**: 3 requests per minute per IP
- **Response**: Returns 429 error if exceeded
- **Message**: "Too many requests. Please try again later."

### reCAPTCHA v3
- **Invisible**: Users never see a challenge
- **Automatic**: Runs in the background
- **Score-based**: Google gives each request a score (0-1)
- **Threshold**: Only allows scores ≥ 0.5 (configurable)

### Honeypot Field
- **Hidden**: Invisible to real users
- **Automatic**: Bots often fill hidden fields
- **Instant**: Rejects submissions if filled

## Testing

### Test Rate Limiting
1. Submit the form 3 times quickly
2. Try a 4th time - should be blocked
3. Wait 1 minute and try again - should work

### Test reCAPTCHA
- If reCAPTCHA keys aren't set, form still works (for development)
- Once keys are added, all submissions are verified automatically

### Test Honeypot
- Form should work normally for real users
- Bots that fill the hidden field are automatically rejected

## Production Notes

1. **Rate Limiting**: Current implementation uses in-memory storage
   - Works great for single-server deployments
   - For multiple servers, consider Redis-based rate limiting
   - Current limit: 3 requests/minute (adjustable in code)

2. **reCAPTCHA**: 
   - Free tier: Unlimited requests
   - No credit card required
   - Works automatically once keys are configured

3. **Monitoring**: 
   - Check server logs for blocked attempts
   - Monitor email volume to detect spam patterns

## Adjusting Rate Limits

To change the rate limit, edit `app/api/contact/route.ts`:

```typescript
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute (change to adjust window)
const RATE_LIMIT_MAX_REQUESTS = 3 // Max requests (change to adjust limit)
```

## Troubleshooting

### reCAPTCHA not working?
- Check that both keys are set in environment variables
- Verify domain is added in reCAPTCHA admin panel
- Check browser console for errors

### Rate limiting too strict?
- Increase `RATE_LIMIT_MAX_REQUESTS` in the API route
- Or increase `RATE_LIMIT_WINDOW` for a longer time window

### Still getting spam?
- Lower reCAPTCHA score threshold (currently 0.5)
- Decrease rate limit further
- Consider adding additional validation

