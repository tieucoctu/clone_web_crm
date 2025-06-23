import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'crm-web-root',
      remotes: {},
      exposes: {},
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  assetsInclude: ['**/*.xlsx,**/*.worker.js'],
});
