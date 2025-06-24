import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'b90984da-f2ce-401a-b2ff-e51f78c3a4c7-00-16fkhpvt7ijnd.picard.replit.dev',
      "2f6c0412-3a60-4141-bd61-a685630caab7-00-1l8qnbuwngo49.worf.replit.dev"
    ],
    proxy: {
      '/api': {
        //target: 'https://fantasy-ug.vercel.app',
      target:  'https://b028de01-ce81-43d6-8fdf-74ddb134d794-00-lejfn7mfojnz.janeway.replit.dev/',
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
