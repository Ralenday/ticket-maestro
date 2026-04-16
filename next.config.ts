/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [60, 70, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;