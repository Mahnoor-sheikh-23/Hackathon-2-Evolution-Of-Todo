/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir: true,
  },
  env: {
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'https://hackathon-2-evolution-of-todo-production.up.railway.app',
    NEXT_PUBLIC_BACKEND_URL: 'https://hackathon-2-evolution-of-todo-production.up.railway.app',
  }
}

module.exports = nextConfig