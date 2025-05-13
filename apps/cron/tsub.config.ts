import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["index.ts"],
  clean: true,
  format: ["cjs"],
  ...options,
}));
