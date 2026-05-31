import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@icons-pack/react-simple-icons"],
  },
};

const withSerwist = withSerwistInit({
  // Service-worker source + output. Stable Serwist builds through webpack.
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Disabled in dev so the SW only runs in production builds.
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
