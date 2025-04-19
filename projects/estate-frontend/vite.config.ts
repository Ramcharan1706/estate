import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // React plugin to handle React transformations like JSX, fast refresh, etc.
    react(),

    // Polyfills for Node.js built-ins (like Buffer)
    nodePolyfills({
      globals: {
        Buffer: true,  // Ensure Buffer is globally available
      },
    }),
  ],

  // Optional: Add custom configurations for environment variable loading
  define: {
    'process.env': process.env,  // Ensure process.env is available (useful for certain libraries)
  },

  // Optional: Define custom build targets (if needed)
  build: {
    target: 'esnext',  // Ensure compatibility with modern JavaScript environments
  },
});
