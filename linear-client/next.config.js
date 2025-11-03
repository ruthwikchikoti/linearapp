/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Only use this if you want to skip type checking during builds
    // ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
