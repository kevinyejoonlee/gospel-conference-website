# Fix Resend Email Issue

## The Problem

Resend's default domain (`onboarding@resend.dev`) only allows sending to **verified/test emails**. You're trying to send to `hello@gospelconference.ca` which isn't verified yet.

## Quick Fix Options

### Option 1: Add Test Email (Fastest - 2 minutes)

1. Go to https://resend.com/emails
2. Click on your API key settings or go to https://resend.com/settings
3. Find "Test Emails" or "Allowed Recipients"
4. Add `hello@gospelconference.ca` as a test recipient
5. Try sending again

### Option 2: Verify Your Domain (Best for Production - 10 minutes)

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Enter `gospelconference.ca`
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)
6. Update `.env.local`:
   ```env
   RESEND_FROM_EMAIL=hello@gospelconference.ca
   ```
7. Restart your server

## After Fixing

Once you've done either option:
1. Restart your dev server (`npm run dev`)
2. Try the contact form again
3. It should work!

## Why This Happened

Resend's free tier uses a default domain for testing. To send to any email address, you need to either:
- Verify your own domain (recommended for production)
- Add recipients as test emails (good for development)

