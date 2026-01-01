/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow API routes to work
  // API routes are needed for Supabase integration
  images: {
    unoptimized: true,
  },
  // Ensure static assets are served correctly
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Ensure proper base path for assets
  basePath: '',
  // Enable static file optimization
  trailingSlash: false,
  // Force clean builds - disable build cache to ensure fresh builds
  experimental: {
    // This helps ensure Cloudflare gets fresh builds
  },
}

export default nextConfig