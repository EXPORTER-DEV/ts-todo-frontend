import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    vueJsx(),
    Icons({
      autoInstall: true
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': 'bootstrap',
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "bootstrap/scss/bootstrap";`
      }
    }
  },
})
