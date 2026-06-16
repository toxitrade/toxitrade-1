/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@deriv/core'],
  turbopack: {
    rules: {},
  },
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig
