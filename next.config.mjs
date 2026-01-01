/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to allow API routes to work
  // API routes are needed for Supabase integration
  images: {
    unoptimized: true,
  },
}

export default nextConfig