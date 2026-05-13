import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: { unoptimized: true },
  experimental: { serverComponentsHmrCache: true },
};

export default nextConfig;
