# Cloudflare Pages Deployment Guide

## Important Note

This project uses Next.js server actions (Stripe integration), which requires server-side functionality. The `@cloudflare/next-on-pages` adapter converts Next.js server functions to Cloudflare Workers.

## Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Click **Connect to Git**
4. Select your repository: `kevinyejoonlee/gospel-conference-website`
5. Select branch: `master`

### 2. Configure Build Settings

**Framework preset**: Next.js

**Build configuration**:
- **Build command**: `npm run cf-build`
- **Build output directory**: `.vercel/output/static`
- **Root directory**: `/` (leave as default)

**Note**: The build command uses `npm run cf-build` which includes `--legacy-peer-deps` to handle the Next.js 16 compatibility issue with `@cloudflare/next-on-pages`.

### 3. Set Environment Variables

In **Pages → Settings → Environment variables**, add:

**Production environment**:
- `STRIPE_SECRET_KEY` = `sk_live_your_production_key`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_your_production_key`
- `NODE_VERSION` = `20`

**Preview environment** (optional):
- `STRIPE_SECRET_KEY` = `sk_test_your_test_key`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_your_test_key`
- `NODE_VERSION` = `20`

### 4. Deploy

Click **Save and deploy**. The first deployment may take a few minutes.

### 5. Custom Domain Setup

#### If your domain is already on Cloudflare:

1. Go to **Pages → Your Project → Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `www.yourdomain.com` or `yourdomain.com`)
4. Cloudflare will automatically create the DNS record

#### If your domain is NOT on Cloudflare:

1. **Add domain to Cloudflare**:
   - Go to Cloudflare Dashboard → **Add a site**
   - Enter your domain and follow the setup wizard
   - Update nameservers at your domain registrar

2. **Wait for DNS propagation** (usually 24-48 hours)

3. **Add custom domain to Pages**:
   - Go to **Pages → Your Project → Custom domains**
   - Click **Set up a custom domain**
   - Enter your domain

### 6. SSL/TLS Settings

Cloudflare automatically provides SSL certificates. Ensure:
- **SSL/TLS encryption mode** is set to **Full** (in DNS → SSL/TLS)
- This is usually automatic for domains on Cloudflare

## Troubleshooting

### Build Fails

- Check that `NODE_VERSION=20` is set in environment variables
- Verify `--legacy-peer-deps` is used in build command
- Check build logs for specific errors

### Server Actions Not Working

- Ensure environment variables are set correctly
- Check that `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are added
- Verify the adapter is running: build command should include `npx @cloudflare/next-on-pages@latest`

### Images Not Loading

- Check that image domains are listed in `next.config.ts` under `remotePatterns`
- Verify external image URLs are accessible

## Alternative: Using OpenNext (Recommended)

The `@cloudflare/next-on-pages` package is deprecated. For production, consider migrating to [OpenNext](https://opennext.js.org/cloudflare) which provides better Next.js 16 support.

## Support

For issues:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)

