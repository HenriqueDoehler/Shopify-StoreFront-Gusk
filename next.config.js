/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.shopify.com"],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
