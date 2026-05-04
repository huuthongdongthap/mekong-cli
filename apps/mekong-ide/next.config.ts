import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const config: NextConfig = {
  ...(isProd ? { output: "export", basePath: "/ide" } : {}),
  images: { unoptimized: true },
};

export default config;
