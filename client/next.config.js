/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Works in Next.js 13+
  watchOptions: {
    poll: 300,
    aggregateTimeout: 300,
  },
};

module.exports = nextConfig;
