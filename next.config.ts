import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  env: {
    EXPO_PUBLIC_MAP_PROVIDER: process.env.EXPO_PUBLIC_MAP_PROVIDER ?? "mapbox",
    EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN:
      process.env.EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN ?? "",
  },
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
