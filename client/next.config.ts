import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  reactStrictMode: true,
  experimental: {
    externalDir: true,
    mcpServer: true,
  },
};

export default nextConfig;
