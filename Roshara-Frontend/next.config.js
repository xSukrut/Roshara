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
        protocol: "https",
        hostname: "localhost", // ✅ local dev URLs
      },
    ],
  },
};

export default nextConfig;
