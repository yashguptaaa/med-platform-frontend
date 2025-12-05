import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // Fix project root detection
  },
};

export default nextConfig;
