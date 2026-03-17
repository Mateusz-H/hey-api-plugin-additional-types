import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./main.ts"],
  format: ["esm"],
  dts: true,
  minify: true,
  sourcemap: false,
  deps: {
    skipNodeModulesBundle: true,
    neverBundle: ["@hey-api"],
  },
});
