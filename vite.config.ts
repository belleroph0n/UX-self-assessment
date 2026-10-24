/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// 'npm run build' produces dist/ for hosting (GitHub Pages, S3 + CloudFront, any static host).
// 'npm run build:single' produces one self-contained HTML file in dist-single/ for previews.
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: mode === "single" ? [viteSingleFile()] : [],
  test: { include: ["tests/**/*.test.ts"] },
  build: {
    outDir: mode === "single" ? "dist-single" : "dist",
    assetsInlineLimit: mode === "single" ? 100_000_000 : 4096,
  },
}));
