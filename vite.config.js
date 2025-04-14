import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`, // import global variables for SCSS
      },
    },
  },
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
    }
}
})
