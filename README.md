# Gospel Conference Website

A website for the Gospel Conference 2025 - "Christ the True and Better" (March 18-20, 2025). This project was created using [v0.dev](https://v0.dev) and includes registration functionality with Stripe payment integration.

## Features

- Conference registration form with attendee information
- Stripe payment integration for secure checkout
- Responsive design with shadcn/ui components
- Multi-step registration process
- Instagram video embed
- Speaker profiles section

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

Note: The `--legacy-peer-deps` flag is required due to React 19 compatibility with some dependencies.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying to Cloudflare Pages

This project is configured for deployment on Cloudflare Pages.

### Build Configuration

1. **Build command**: `npx @cloudflare/next-on-pages@latest`
2. **Output directory**: `.vercel/output/static`
3. **Node version**: Set to 20 in Cloudflare Pages settings (NODE_VERSION environment variable)

### Deployment Steps

1. Push your code to GitHub
2. In Cloudflare Dashboard, go to **Pages** → **Create project**
3. Connect to your Git repository
4. Configure build settings:
   - **Framework preset**: Next.js
   - **Build command**: `npx @cloudflare/next-on-pages@latest`
   - **Output directory**: `.vercel/output/static`
5. Add environment variables in **Pages → Settings → Environment variables**:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NODE_VERSION=20`
6. Click **Save and deploy**

### Custom Domain Setup

1. If your domain is already on Cloudflare:
   - Go to **Pages → Custom domains → Add custom domain**
   - Choose your domain (e.g., `www.yourdomain.com` or `yourdomain.com`)
   - Cloudflare will automatically add the DNS record

2. If your domain is not on Cloudflare:
   - Add the domain to Cloudflare first
   - Change nameservers at your registrar
   - Then add the custom domain in Pages

### Local Preview

To test the Cloudflare Pages build locally:

```bash
npm run pages:build
npx wrangler pages dev .vercel/output/static --functions .vercel/output/functions
```

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - React components including:
  - `header.tsx` - Conference header with logo and dates
  - `hero.tsx` - Full-screen hero section with logo and conference info
  - `about-section.tsx` - About section with Instagram video embed
  - `speakers-section.tsx` - Main speaker and seminar speakers
  - `registration-section.tsx` - Main registration section
  - `registration-form.tsx` - Multi-step registration form
  - `checkout.tsx` - Stripe embedded checkout component
- `lib/` - Utility functions and configurations
  - `stripe.ts` - Stripe client initialization
  - `products.ts` - Product/registration pricing configuration

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Stripe Documentation](https://stripe.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
