// vite.config.js
import path from "path";
import tailwindcss from "file:///home/runner/workspace/node_modules/@tailwindcss/vite/dist/index.mjs";
import react from "file:///home/runner/workspace/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///home/runner/workspace/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/home/runner/workspace";
var vite_config_default = defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "661a859e-215d-4ee7-ad03-221007b9ef75-00-yr7tnm5anqkz.picard.replit.dev"
    ]
    /*  proxy: {
        '/api': {
        target:  'https://ee1a059c-b787-4f48-b3ec-bbb68d03c9f3-00-gliq45vvkqid.riker.replit.dev/',
          changeOrigin: true
        },
      },*/
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9ydW5uZXIvd29ya3NwYWNlL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3J1bm5lci93b3Jrc3BhY2Uvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuXG4vLyBodHRwczovL3ZpdGUuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCB0YWlsd2luZGNzcygpXSxcbiAgc2VydmVyOiB7XG4gICAgYWxsb3dlZEhvc3RzOiBbXG4gICAgICAnNjYxYTg1OWUtMjE1ZC00ZWU3LWFkMDMtMjIxMDA3YjllZjc1LTAwLXlyN3RubTVhbnFrei5waWNhcmQucmVwbGl0LmRldiddXG4gICAgLFxuICAvKiAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgdGFyZ2V0OiAgJ2h0dHBzOi8vZWUxYTA1OWMtYjc4Ny00ZjQ4LWIzZWMtYmJiNjhkMDNjOWYzLTAwLWdsaXE0NXZ2a3FpZC5yaWtlci5yZXBsaXQuZGV2LycsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZVxuICAgICAgfSxcbiAgICB9LCovXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLE9BQU8sVUFBVTtBQUNyUSxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFIN0IsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7QUFBQSxFQUNoQyxRQUFRO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDWjtBQUFBLElBQXdFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFRNUU7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
