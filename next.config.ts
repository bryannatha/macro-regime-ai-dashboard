import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pdfjs-dist", "@napi-rs/canvas"],
  outputFileTracingIncludes: {
    "/api/market-data": [
      "./node_modules/@napi-rs/canvas/**/*",
      "./node_modules/@napi-rs/canvas-*/**/*",
    ],
  },
};

export default nextConfig;
