# Cloudflare Pages Deployment Guide

This guide explains what environment variables and secrets you need to add in Cloudflare Pages for your Gospel Conference website.

## Required Environment Variables

Add these in your Cloudflare Pages dashboard under **Settings > Environment Variables**:

### 1. Supabase Configuration (Required)

These are needed for database operations (donations, registrations, volunteers, t-shirts):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** 
- `NEXT_PUBLIC_*` variables are public and safe to expose
- `SUPABASE_SERVICE_ROLE_KEY` is a **secret** - keep it private!

## How to Add Environment Variables in Cloudflare Pages

1. Go to your Cloudflare Dashboard
2. Navigate to **Pages** > Your Project
3. Go to **Settings** > **Environment Variables**
4. Add each variable:
   - Click **Add variable**
   - Enter the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter the value
   - Select which environments to apply to (Production, Preview, or both)
   - Click **Save**

## Important Notes for Cloudflare Pages

### Next.js Runtime
Since your app uses API routes (for Supabase integration), you need to ensure Cloudflare Pages is configured to use the Next.js runtime:

1. In Cloudflare Pages, go to **Settings** > **Builds & deployments**
2. Make sure the **Framework preset** is set to **Next.js**
3. The build command should be: `npm run build` or `pnpm build`
4. **IMPORTANT**: The output directory should be: `.next` (NOT `out`)
   - Cloudflare may default to `out` for static sites, but you need `.next` for API routes
   - If you see "Output directory 'out' not found" error, change it to `.next` in Cloudflare settings

### Build Configuration

Your `next.config.mjs` is already configured correctly (no static export, which allows API routes).

### Environment Variables Scope

- **Production**: Variables available in production deployments
- **Preview**: Variables available in preview deployments (pull requests)
- You can set different values for each environment if needed

## Security Best Practices

1. **Never commit secrets to Git**: Your `.env.local` file should be in `.gitignore` (it already is)
2. **Use Cloudflare Secrets**: For sensitive values like `SUPABASE_SERVICE_ROLE_KEY`, use Cloudflare's environment variables (they're encrypted)
3. **Rotate keys regularly**: If a key is compromised, regenerate it in Supabase and update Cloudflare

## Verifying Deployment

After adding the environment variables:

1. Trigger a new deployment (or push to your main branch)
2. Check the build logs to ensure no "Missing environment variables" errors
3. Test the forms:
   - Donate page should save to Supabase
   - Register page should save to Supabase
   - Volunteer page should save to Supabase
4. Check your Supabase dashboard to verify data is being saved

## Troubleshooting

### "Missing Supabase environment variables" error
- Verify all three Supabase variables are added in Cloudflare
- Make sure they're added to the correct environment (Production/Preview)
- Check for typos in variable names (case-sensitive!)

### API routes not working
- Ensure Framework preset is set to **Next.js** in Cloudflare
- Verify `next.config.mjs` doesn't have `output: 'export'` (it doesn't)
- Check build logs for any errors

### Build fails
- Check that all environment variables are set
- Verify your Supabase keys are correct
- Check Cloudflare build logs for specific error messages

## Current Environment Variables Summary

| Variable Name | Type | Required | Description |
|--------------|------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Yes | Supabase service role key (admin access) |

## Next Steps

1. Add all three environment variables in Cloudflare Pages
2. Deploy your site
3. Test the forms to ensure Supabase integration works
4. Monitor your Supabase dashboard to verify data is being saved

