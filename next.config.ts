import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/export-zip/*": ["./node_modules/tailwindcss/index.css"],
    "/api/export/*": ["./node_modules/tailwindcss/index.css"],
  },
};

export default nextConfig;
