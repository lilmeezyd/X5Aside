import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      '661a859e-215d-4ee7-ad03-221007b9ef75-00-yr7tnm5anqkz.picard.replit.dev']
    ,
  /*  proxy: {
      '/api': {
      target:  'https://ee1a059c-b787-4f48-b3ec-bbb68d03c9f3-00-gliq45vvkqid.riker.replit.dev/',
        changeOrigin: true
      },
    },*/
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
