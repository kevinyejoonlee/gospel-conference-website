# Testing Stripe Without a Bank Account

## ✅ Yes, You Can Test Everything Without Adding a Bank Account!

Stripe has a **Test Mode** that lets you fully test your payment integration without:
- Adding a bank account
- Using real credit cards
- Moving any real money

## Quick Setup (5 Minutes)

### 1. Create Stripe Account (Free)
- Go to https://stripe.com
- Sign up (no credit card or bank account required)
- You'll automatically be in **Test Mode**

### 2. Get Your Test API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_` - click "Reveal test key")

### 3. Add Keys to Your Project
Create or update `.env.local` in your project root:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Test Webhooks Locally (Optional but Recommended)

Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Or download from: https://stripe.com/docs/stripe-cli
```

Login and forward webhooks:
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook secret (starts with `whsec_`) and add to `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 5. Start Testing!

1. Run your dev server: `npm run dev`
2. Go to `/donate`, `/register`, or `/volunteer`
3. Fill out the form
4. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - Postal: Any code (e.g., 12345)

## Test Card Numbers

Stripe provides several test cards for different scenarios:

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires authentication |
| `4000 0000 0000 9995` | Insufficient funds |

See all test cards: https://stripe.com/docs/testing

## Viewing Test Data

### Payments
- Go to: https://dashboard.stripe.com/test/payments
- See all test transactions (no real money!)

### Customers
- Go to: https://dashboard.stripe.com/test/customers
- See all customer data with metadata

### Checkout Sessions
- Go to: https://dashboard.stripe.com/test/checkout/sessions
- See all checkout sessions

### Using the API Endpoint
You can also query your test data via the API:
```bash
# Get all donations
curl http://localhost:3000/api/donations?type=donate

# Get all registrations
curl http://localhost:3000/api/donations?type=register

# Get all data
curl http://localhost:3000/api/donations
```

## Important Notes

### Test Mode vs Live Mode

**Test Mode (what you're using now):**
- ✅ No bank account needed
- ✅ No real money
- ✅ Use `sk_test_` and `pk_test_` keys
- ✅ Perfect for development

**Live Mode (when ready for real payments):**
- ⚠️ Requires bank account
- ⚠️ Real money transactions
- ⚠️ Use `sk_live_` and `pk_live_` keys
- ⚠️ Only switch when ready!

### Switching Between Modes

In Stripe Dashboard, you'll see a toggle at the top:
- **Test mode** - For development (current)
- **Live mode** - For production (requires bank account)

Make sure you're using the correct keys for each mode!

## Troubleshooting

### "Invalid API Key"
- Make sure you're using test keys (`sk_test_` and `pk_test_`)
- Check that keys are in `.env.local` (not committed to git)
- Restart your dev server after adding keys

### "Webhook signature verification failed"
- Make sure `STRIPE_WEBHOOK_SECRET` is set
- If using Stripe CLI, use the secret it provides
- Restart your dev server after updating

### "No checkout URL received"
- Check your server logs for errors
- Verify `STRIPE_SECRET_KEY` is correct
- Make sure you're in Test Mode in Stripe Dashboard

## Ready for Production?

When you're ready to accept real payments:

1. **Add your bank account** in Stripe Dashboard
2. **Switch to Live Mode** in Stripe Dashboard
3. **Get your Live API keys** (start with `sk_live_` and `pk_live_`)
4. **Update `.env.local`** with live keys
5. **Set up production webhook** at your domain
6. **Test with a small real payment** first!

## Resources

- Stripe Testing Docs: https://stripe.com/docs/testing
- Test Cards: https://stripe.com/docs/testing#cards
- Stripe Dashboard: https://dashboard.stripe.com/test
- Stripe CLI: https://stripe.com/docs/stripe-cli

