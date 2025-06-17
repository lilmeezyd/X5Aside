import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      'b90984da-f2ce-401a-b2ff-e51f78c3a4c7-00-16fkhpvt7ijnd.picard.replit.dev'
    ],
    proxy: {
      '/api': {
        //target: 'https://fantasy-ug.vercel.app',
        target: 'https://ef92cda3-f4b1-4b9a-ba68-cad743a7aa2e-00-1r75rqg8zlhj1.kirk.replit.dev/',
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
