# Stripe Integration Setup Guide

This guide will help you set up Stripe payments for the Gospel Conference registration and volunteer forms.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com) - **No bank account needed for testing!**
2. Your Stripe API keys from the Stripe Dashboard

## ⚡ Quick Start: Testing Without a Bank Account

**Yes, you can test Stripe completely without adding a bank account!** Stripe has a "Test Mode" that lets you simulate payments using fake credit cards.

### Steps to Test:

1. **Sign up for Stripe** (free, no bank account required)
   - Go to https://stripe.com and create an account
   - You'll automatically be in "Test Mode" by default

2. **Get your Test API Keys** (they start with `sk_test_` and `pk_test_`)
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy your test keys (these are safe to use in development)

3. **Add keys to your `.env.local` file:**
   ```env
   STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here
   ```

4. **Test with fake cards:**
   - Use card number: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/25)
   - Any 3-digit CVC (e.g., 123)
   - Any postal code (e.g., 12345)

5. **View test payments:**
   - Go to https://dashboard.stripe.com/test/payments
   - You'll see all your test transactions (no real money moves!)

**Note:** When you're ready to accept real payments, you'll need to:
- Switch to "Live Mode" in Stripe
- Add your bank account
- Use live API keys (starting with `sk_live_` and `pk_live_`)

## Setup Steps

### 1. Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret Key** (starts with `sk_test_` for test mode or `sk_live_` for production)
3. Copy your **Publishable Key** (starts with `pk_test_` for test mode or `pk_live_` for production)

### 2. Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For production**, use your live keys:
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Set Up Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`) and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

**For local development**, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
This will give you a webhook secret to use in development.

### 4. Configure Payment Amount

Edit `/app/api/create-checkout-session/route.ts` and update the registration amount:

```typescript
const amount = type === 'register' ? 5000 : 0 // $50.00 in cents
```

Change `5000` to your desired amount in cents (e.g., `7500` for $75.00).

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Go to any page (donate, register, or volunteer)
3. Fill out the form
4. Click "DONATE NOW", "PAY NOW", or "SUBMIT APPLICATION"
5. Use Stripe test cards (no real money is charged!):
   
   **Successful Payment:**
   - Card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/25)
   - Any 3-digit CVC (e.g., 123)
   - Any postal code (e.g., 12345)
   
   **Other Test Cards:**
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`
   - See more: https://stripe.com/docs/testing

6. **Check your test transactions:**
   - Go to https://dashboard.stripe.com/test/payments
   - You'll see all test payments (they're fake, no bank account needed!)
   - Check metadata to see form data stored

### Testing Webhooks Locally

For local webhook testing (without deploying):

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```

3. **Forward webhooks to local server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   
   This will give you a webhook secret (starts with `whsec_`) - add it to `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_secret_from_cli
   ```

4. **Now test a payment** - the webhook will be forwarded to your local server!

## How It Works

### Registration Flow

1. User fills out the registration form
2. Form data is sent to `/api/create-checkout-session`
3. Stripe Checkout session is created with all form data stored as metadata
4. User is redirected to Stripe Checkout to complete payment
5. After payment, webhook receives `checkout.session.completed` event
6. Customer information is stored in Stripe with all form data in metadata
7. User is redirected back to your site

### Donation Flow

1. User visits the donate page and selects/enters a donation amount
2. Optional donor information is collected (name, email)
3. Form data is sent to `/api/create-checkout-session` with `type: 'donate'`
4. Stripe Checkout session is created with the donation amount
5. User is redirected to Stripe Checkout to complete payment
6. After payment, webhook receives `checkout.session.completed` event
7. Donation information is logged and stored in Stripe metadata
8. User is redirected back to your site

### Volunteer Flow

1. User fills out the volunteer application form
2. Form data is sent to `/api/create-checkout-session` (free)
3. Stripe Checkout session is created (no payment required, but collects payment method for future use)
4. User completes the checkout process
5. All volunteer information is stored in Stripe metadata
6. User is redirected back to your site

## Accessing Customer Data in Stripe

All registration, donation, and volunteer information is stored in Stripe:

1. Go to https://dashboard.stripe.com/customers
2. Click on any customer
3. Scroll down to "Metadata" to see all form data:
   - Registration type (register/volunteer/donate)
   - All form fields (name, email, address, etc.)
   - Registration date
   - Donation amounts (for donations)

## Tracking Donations

### Viewing Donation Totals via API

You can query donation totals using the `/api/donations` endpoint:

**Get all statistics:**
```bash
GET /api/donations
```

**Get only donations:**
```bash
GET /api/donations?type=donate
```

**Get only registrations:**
```bash
GET /api/donations?type=register
```

**Get only volunteers:**
```bash
GET /api/donations?type=volunteer
```

**Example Response (type=donate):**
```json
{
  "type": "donate",
  "total": 1250.00,
  "currency": "CAD",
  "count": 8,
  "donations": [
    {
      "id": "cs_...",
      "donorName": "John Doe",
      "amount": 100.00,
      "currency": "CAD",
      "timestamp": "2026-01-15T10:30:00Z",
      "email": "john@example.com"
    }
  ]
}
```

**Example Response (all types):**
```json
{
  "summary": {
    "totalDonations": {
      "amount": 1250.00,
      "currency": "CAD",
      "count": 8
    },
    "totalRegistrations": {
      "amount": 500.00,
      "currency": "CAD",
      "count": 10
    },
    "totalVolunteers": {
      "count": 5
    },
    "grandTotal": {
      "amount": 1750.00,
      "currency": "CAD"
    }
  },
  "donations": [...],
  "registrations": [...],
  "volunteers": [...]
}
```

### Viewing in Stripe Dashboard

1. Go to https://dashboard.stripe.com/payments
2. Filter by payment status: "Succeeded"
3. Look for payments with metadata `type: donate`
4. You can also view checkout sessions at https://dashboard.stripe.com/checkout/sessions

### Webhook Logs

The webhook now logs detailed information for each transaction:
- **Donations**: Logged with "✅ DONATION RECEIVED" including amount and donor name
- **Registrations**: Logged with "✅ REGISTRATION COMPLETED"
- **Volunteers**: Logged with "✅ VOLUNTEER APPLICATION SUBMITTED"
- **Payments**: Logged with "💳 PAYMENT SUCCEEDED" including amount

Check your server logs or hosting platform logs to see these entries.

## Customization

### Change Success/Cancel URLs

Edit the `success_url` and `cancel_url` in `/app/api/create-checkout-session/route.ts`:

```typescript
success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register?success=true&session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register?canceled=true`,
```

### Add Database Storage

To store registrations in your database, edit `/app/api/webhook/route.ts` and add database logic in the `checkout.session.completed` handler.

## Security Notes

- Never commit `.env.local` to version control
- Always use environment variables for API keys
- Use test keys for development, live keys only in production
- Verify webhook signatures to ensure requests are from Stripe

## Support

For Stripe-specific issues, check:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com



