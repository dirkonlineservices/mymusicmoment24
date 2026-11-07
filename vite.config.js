import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// isSsrBuild: beim SSR-Build (dist-ssr) keine Vendor-Chunks, dort bleibt React extern
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  assetsInclude: ['**/*.md'],
  build: {
    target: 'es2020',
    copyPublicDir: !isSsrBuild,
    cssCodeSplit: true,
    rollupOptions: {
      output: isSsrBuild ? {} : {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react', 'react-icons'],
          'vendor-paypal': ['@paypal/react-paypal-js'],
          'vendor-marked': ['marked']
        }
      }
    }
  }
}));
