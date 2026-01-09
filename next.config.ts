import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //ignore typescript errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
