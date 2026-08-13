import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    EXPO_PUBLIC_MAP_PROVIDER: process.env.EXPO_PUBLIC_MAP_PROVIDER ?? "mapbox",
    EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN:
      process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN ?? "",
  },
};

export default nextConfig;
