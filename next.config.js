/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@deriv/core'],
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
