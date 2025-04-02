import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Configure the development server port
    port: 5173,
    // Automatically open the app in the browser on server start
    open: true,
    // Configure proxy rules for API requests during development
    // This avoids CORS issues by forwarding requests from the Vite dev server (e.g., localhost:5173)
    // to the backend server (e.g., localhost:3001)
    proxy: {
      // Proxy requests starting with '/api' to the backend server
      '/api': {
        target: 'http://localhost:3001', // Target backend server address
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Set to false if backend is running on http
      },
    },
  },
  build: {
    // Specify the output directory for the production build
    outDir: 'dist',
    // Generate source maps for production build to aid debugging
    sourcemap: true,
  },
  test: {
    // Enable Vitest global APIs (describe, test, expect, etc.)
    globals: true,
    // Use 'jsdom' to simulate a browser environment for component testing
    environment: 'jsdom',
    // Specify setup files to run before each test file
    // Useful for configuring testing libraries or global mocks
    setupFiles: './src/setupTests.js',
  },
});