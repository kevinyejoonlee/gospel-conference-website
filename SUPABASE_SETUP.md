# Supabase Donation Tracking Setup Guide

This guide will help you set up Supabase to track donations on your Gospel Conference website.

## Prerequisites

- A Supabase account and project (you already have this: `ivilxyywomjyddcaswiw`)
- Node.js and npm/pnpm installed

## Step 1: Install Dependencies

First, install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

Or if you're using pnpm:

```bash
pnpm add @supabase/supabase-js
```

## Step 2: Get Your Supabase API Keys

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ivilxyywomjyddcaswiw
2. Navigate to **Settings** (gear icon) > **API**
3. You'll find:
   - **Project URL**: Should be `https://ivilxyywomjyddcaswiw.supabase.co`
   - **anon/public key**: This is your publishable key (starts with `eyJ...`)
   - **service_role key**: This is your secret key (starts with `eyJ...`)

**Note:** If the keys you have don't start with `eyJ`, they might be from a different format. Use the keys from the Supabase Dashboard under Settings > API.

## Step 3: Create Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```env
# Supabase Configuration
# Get these values from Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://ivilxyywomjyddcaswiw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace `your_anon_key_here` and `your_service_role_key_here` with the actual keys from your Supabase Dashboard.

**Important:** 
- The `.env.local` file is already in `.gitignore`, so it won't be committed to your repository
- Never share your `SUPABASE_SERVICE_ROLE_KEY` publicly - it has admin access to your database
- If you provided keys with `sb_publishable_` or `sb_secret_` prefixes, those might not be the standard Supabase format. Please use the keys from the Dashboard.

## Step 4: Set Up the Database Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/ivilxyywomjyddcaswiw
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase-setup.sql` into the editor
5. Click **Run** to execute the SQL

This will create:
- A `donations` table with columns: `id`, `name`, `email`, `amount`, `created_at`, `updated_at`
- Indexes for better query performance
- Row Level Security (RLS) policies
- An automatic timestamp update trigger

## Step 5: Verify Your Supabase URL

Make sure your Supabase project URL is correct. The format should be:
```
https://[PROJECT_ID].supabase.co
```

Your project ID is: `ivilxyywomjyddcaswiw`

So your URL should be: `https://ivilxyywomjyddcaswiw.supabase.co`

You can verify this in your Supabase Dashboard under **Settings > API**.

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the donate page: `http://localhost:3000/donate`

3. Try submitting a test donation (you can use test data)

4. Check your Supabase Dashboard:
   - Go to **Table Editor** > `donations`
   - You should see your test donation entry

5. Verify the progress bar updates with the total amount

## How It Works

1. **When a donation is submitted:**
   - The form data is sent to both:
     - Supabase (for database tracking)
     - FormSubmit (for email notification)
   - The donation is stored in the `donations` table
   - The progress bar automatically updates

2. **Progress Bar:**
   - Fetches the total donations from Supabase on page load
   - Updates in real-time after each donation
   - Shows: `Raised: $X.XX` and `Goal: $3,000.00`

3. **API Routes:**
   - `GET /api/donations` - Fetches total donations
   - `POST /api/donations` - Creates a new donation record

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in the root directory
- Restart your development server after creating/updating `.env.local`
- Verify the variable names match exactly (case-sensitive)

### "Failed to create donation" error
- Check that the `donations` table exists in Supabase
- Verify your API keys are correct
- Check the Supabase Dashboard logs for detailed error messages

### Progress bar shows $0.00
- Make sure the `donations` table has been created
- Check that donations are being inserted successfully
- Verify the API route is working: `http://localhost:3000/api/donations`

### Database connection issues
- Verify your Supabase project is active
- Check that your project URL is correct
- Ensure your API keys haven't been rotated

## Security Notes

- The `SUPABASE_SERVICE_ROLE_KEY` should only be used server-side (in API routes)
- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose in client-side code
- Row Level Security (RLS) is enabled on the donations table
- Consider adding additional RLS policies if you need more restrictive access

## Next Steps

- View donation analytics in Supabase Dashboard
- Export donation data for accounting/reporting
- Set up email notifications when donations are received
- Add donation filtering/searching capabilities

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the Supabase Dashboard logs
3. Verify all environment variables are set correctly
4. Ensure the database table was created successfully

