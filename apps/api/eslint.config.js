import config from "@packages/config-eslint";

/** @type {import("eslint").FlatConfig[]} */
export default [
  ...config,
  {
    ignores: ["src/generated/**"],
  },
];