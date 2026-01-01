# Cloudflare Pages Setup for Next.js with API Routes

# Cloudflare Pages Setup for Next.js with API Routes

## ⚠️ IMPORTANT: Cloudflare Pages Requires Adapter

Cloudflare Pages does **NOT** natively support Next.js API routes with `.next` directory. You need the `@cloudflare/next-on-pages` adapter.

## Current Configuration (Matches Your Cloudflare Settings)

- **Build Command**: `npx @cloudflare/next-on-pages@1` ✓
- **Build Output Directory**: `.vercel/output/static` ✓
- **Framework Preset**: Next.js ✓

## Your Cloudflare Settings Are CORRECT!

Your current Cloudflare configuration is correct:
- ✅ Build command: `npx @cloudflare/next-on-pages@1`
- ✅ Build output: `.vercel/output/static`
- ✅ Framework preset: Next.js

## Important Settings in Cloudflare Pages

1. **Go to**: Settings → Builds & deployments → Build configuration
2. **Verify**:
   - Build command: `npm run build`
   - Build output directory: `.next` (NOT `out`)
   - Framework preset: **Next.js** (if available)

## Why `.next` and not `out`?

- `out/` = Static export only (no API routes)
- `.next/` = Full Next.js with API routes support
- Your Supabase API routes (`/api/donations`, `/api/registrations`, etc.) need `.next`

## Build Cache

If you're seeing old bundles:
1. Go to Settings → Builds & deployments
2. Find "Build cache" section
3. Click "Clear Cache"
4. Redeploy

## Environment Variables

Make sure these are set in Cloudflare Pages:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

### Old JavaScript bundles still loading
- Clear Cloudflare build cache
- Clear browser cache
- Wait for new deployment to complete
- Check deployment logs to verify `@vercel/analytics` is NOT installed

### API routes not working
- Verify build output directory is `.next` (not `out`)
- Check that `output: 'export'` is NOT in `next.config.mjs`
- Verify environment variables are set

