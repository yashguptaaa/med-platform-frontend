import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // Fix project root detection
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.201.99.3:4000/api/:path*", // Your EC2 backend
      },
    ];
  },
};

export default nextConfig;
