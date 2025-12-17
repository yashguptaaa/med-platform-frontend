import type { NextConfig } from "next";

const INSTANCE_IP =
  process.env.EIP || "15.207.54.240";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${INSTANCE_IP}:4000/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
