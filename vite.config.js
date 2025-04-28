import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ViteVuetify from "vite-plugin-vuetify";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), ViteVuetify()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import \"@/assets/styles/variables.scss\";", // import global variables for SCSS
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup/vuetify.js",
    include: ["tests/**/*.spec.{js,ts}"], // Tells Vitest where to find the test files
    transform: {
      "\\.css$": "vitest-plugin-mock-css", // Mock CSS for testing
    },
    server: {
      deps: {
        inline: ["vuetify"]
      }
    }
  },
});
