import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  cacheStartUrl: false,
  dynamicStartUrl: false,
  fallbacks: { document: "/offline" },
  runtimeCaching: [{ urlPattern: /^https?:\/\/.*/i, handler: "NetworkOnly", options: {} }],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.FLOWLOG_BUILD_DIR || ".next",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingIncludes: {
    "/*": ["./prisma/dev.db", "./prisma/migrations/**/*"],
  },
};

export default withPWA(nextConfig);
