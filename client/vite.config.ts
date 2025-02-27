import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression(), // Enables gzip compression
    visualizer(), // Generates bundle size visualization
  ],
  server: {
    watch: {
      usePolling: true,
    },
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
  build: {
    minify: 'terser', // Use terser for better minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Split vendor chunks
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    sourcemap: false, // Disable sourcemaps in production
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000')
  }
});
