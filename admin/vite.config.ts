import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Enable polling for file changes inside Docker
    },
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
  },
});
