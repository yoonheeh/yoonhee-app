/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Add this for better static file serving
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  /* config options here */
};

module.exports = nextConfig; 