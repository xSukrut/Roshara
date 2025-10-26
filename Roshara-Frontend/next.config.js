/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com", // ✅ allow placeholder images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ if you use Cloudinary
      },
      {
        protocol: "https",
        hostname: "example.com", // ✅ added this
      },
      {
        protocol: "http", // 👈 important — local dev usually runs on http
        hostname: "localhost",
        port: "5000", // 👈 your backend port
      },
    ],
  },
};

export default nextConfig;
