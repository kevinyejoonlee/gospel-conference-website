/** @type {import('next').NextConfig} */
const nextConfig = {
  // Using .next directory for API routes support
  // API routes are needed for Supabase integration
  // DO NOT use 'output: export' - it breaks API routes
  images: {
    unoptimized: true,
  },
  // Ensure static assets are served correctly on Cloudflare Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  basePath: '',
  trailingSlash: false,
}

export default nextConfig