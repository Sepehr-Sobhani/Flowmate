/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", "localhost"],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
    // Fix for Server Action caching issues
    resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  // Ensure proper server/client separation
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: ["localhost:3000"],
    },
  },
};

module.exports = nextConfig;
