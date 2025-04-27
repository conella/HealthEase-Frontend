import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        global: true,
      },
      sourceType: "module",
    },
    plugins: {
      js,
      vue: pluginVue,
    },
    rules: {
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: ["Alert", "Nav", "Home", "Layout", "Login", "Register", "default", "Settings", "Dashboard"],
        },
      ],
      "quotes": ["error", "double"],
    },
  },
  pluginVue.configs["flat/essential"],
]);