// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "http",  hostname: "localhost", port: "5000" },
      { protocol: "https", hostname: "roshara.in" },
      { protocol: "https", hostname: "api.roshara.in" },
    ],
  },
};

module.exports = nextConfig;
