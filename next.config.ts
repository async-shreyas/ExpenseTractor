/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['expensetractor.vercel.app'], // Add any domains you need for images
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // For Sentry integration
  sentry: {
    hideSourceMaps: true,
  },
  // For production optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;