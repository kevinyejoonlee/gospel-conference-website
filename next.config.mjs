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
  // Ensure public folder is included in build
  publicRuntimeConfig: {},
  // Optimize for Cloudflare Pages
  experimental: {
    // Ensure proper static asset handling
  },
}

export default nextConfig