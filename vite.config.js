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
        examples: resolve(__dirname, 'examples.html'),
        foundingLocal: resolve(__dirname, 'founding-local.html'),
        whyWebsite: resolve(__dirname, 'why-a-website.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
      },
    },
  },
})
