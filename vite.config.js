import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'https://b028de01-ce81-43d6-8fdf-74ddb134d794-00-lejfn7mfojnz.janeway.replit.dev/',
      "2f6c0412-3a60-4141-bd61-a685630caab7-00-1l8qnbuwngo49.worf.replit.dev",
      "56e69f09-41cf-4a85-b668-ec2034e6d7e6-00-1t4zcbwe7akvt.picard.replit.dev"
    ],
    proxy: {
      '/api': {
        //target: 'https://fantasy-ug.vercel.app',
      target:  'https://ee1a059c-b787-4f48-b3ec-bbb68d03c9f3-00-gliq45vvkqid.riker.replit.dev/',
        changeOrigin: true
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
