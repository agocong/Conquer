import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 子路径
  base: '/Conquer/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    // Enable minification and tree-shaking (default in Vite, but explicit)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Target modern browsers for smaller output
    target: 'es2020',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-three': ['three'],
        },
      },
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
});
