import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    serverActions: {
      // The admin product form sends images as base64 data URLs (2MB file
      // cap each, ~2.7MB encoded). Next's 1MB default rejects the save with
      // an opaque "Failed to fetch".
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
