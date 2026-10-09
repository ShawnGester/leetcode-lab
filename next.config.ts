import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API route shells out to javac/java — keep dynamic Node behavior.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
