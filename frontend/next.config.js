/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is enabled by default in Next.js 16+
  },
  env: {
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'https://hackathon-2-evolution-of-todo-production.up.railway.app',
    NEXT_PUBLIC_BACKEND_URL: 'https://hackathon-2-evolution-of-todo-production.up.railway.app',
  },
  // Performance optimizations
  compiler: {
    removeConsole: false, // Keep console logs for debugging
  },
}

module.exports = nextConfig