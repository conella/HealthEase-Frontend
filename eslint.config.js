import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: "module",
    },
    plugins: {
      js,
      vue: pluginVue,
    },
    extends: [
      "js/recommended",
      // We could extend Vue configs here too if needed
    ],
    rules: {
      // General JS rules
      "no-console": "warn",
      "no-debugger": "error",
      "eqeqeq": ["error", "always"],
      "curly": "error",
      "semi": ["error", "always"], // I'll decide if I need to keep this later
      "quotes": ["error", "single"],
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Vue-specific rules
      "vue/no-unused-components": "warn",
      "vue/no-mutating-props": "error",
      "vue/html-self-closing": ["error", {
        html: {
          void: "always",
          normal: "always",
          component: "always"
        }
      }]
    },
  },

  // Vue config (still needed separately)
  pluginVue.configs["flat/essential"],
]);