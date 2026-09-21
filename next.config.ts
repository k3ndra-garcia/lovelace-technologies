import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/insights", destination: "/case-studies", permanent: true },
      { source: "/work", destination: "/case-studies", permanent: true },
    ];
  },
};

export default nextConfig;
