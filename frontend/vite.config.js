import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During `npm run dev`, requests to /api/* are proxied to the FastAPI
// backend so the browser never has to worry about CORS or hardcoded
// hosts. In production the React build is served directly by FastAPI
// (see main.py), so /api/* is same-origin and no proxy is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
