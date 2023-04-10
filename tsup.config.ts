import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",

  format: ["esm"],
  target: "es2020",
  platform: "neutral",

  dts: true,
  sourcemap: true,
});
