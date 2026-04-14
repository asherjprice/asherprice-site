import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        showcase: resolve(__dirname, 'showcase.html'),
        whyWebsite: resolve(__dirname, 'why-a-website.html'),
      },
    },
  },
})
