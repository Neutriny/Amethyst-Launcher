import js from "@eslint/js";
import { defineConfig, type ConfigObject } from "eslint/config";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig(
  {
    ignores: ["node_modules/**", "dist/**", "src-tauri/**", "pnpm-lock.yaml", "*.config.*"],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  solid.configs["flat/recommended"] as unknown as ConfigObject,
  prettierConfig,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "warn",
      "solid/reactivity": "warn",
      "solid/no-destructure": "warn",
      "solid/jsx-no-undef": "error",
      "solid/jsx-uses-vars": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
