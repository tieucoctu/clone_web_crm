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
    proxy: {
      '/msx-lead': {
        target: 'https://uat-api-crm.datxanh.com.vn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/msx-lead/, '/msx-lead'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmU2N6TTQ2NnpXYTd0cmF3eUZiRVZhR2h3MzVpZXhFOWhHM2JMNGJrZUhJIn0.eyJleHAiOjE3NTAzMzYwODYsImlhdCI6MTc1MDMwMDA4NiwianRpIjoiNjc2YzM5NTktY2NmMi00YTQ5LWJlNzQtOTYzZDE2NDBiZjBmIiwiaXNzIjoiaHR0cHM6Ly91YXQta2V5Y2xvYWsuZGF0eGFuaC5jb20udm4vcmVhbG1zL2VtcGxveWVlIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6IjJmY2I1MzliLTEzZTgtNGNkYy1hMTU4LWNlZDllM2VmMGZmNCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcC1jcm0tYXBwIiwic2lkIjoiYjlmZmJiZGQtYjc2Ni00YWZmLWFiMGEtN2VhZTU5ZmJiMTRkIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1lbXBsb3llZSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJ1cGRhdGUtb3RwIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LWV2ZW50cyIsIm1hbmFnZS11c2VycyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIiwicXVlcnktdXNlcnMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJ2aWV3LWdyb3VwcyIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoixJDDqiBLYSBN4budIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiY3JtYWRtaW4iLCJnaXZlbl9uYW1lIjoixJDDqiIsImZhbWlseV9uYW1lIjoiS2EgTeG7nSIsImVtYWlsIjoiY3JtYWRtaW5AZ21haWwuY29tIn0.U2EV41vLzXUYS-58CWNrEkjsW81POJHwrhSbnAa5Jn44YzPWYemzyMSdKCcR4tEdQsBn6jb2J_bQR9IyllGqZ_FZ-o5CACnHunHmjBxYakbLlt_B8UlNt4QwlxvYs7kqO6Cnj1QEzZZhIuWk1SQ3TDC2BB9vYG9eHvFPLio8p274fL99ZZwJii-bSVP_AD7GG7aVc2gT3mJEcanHyHbuSRwyU8QhjyfWoGm852UJvh0hAYdWkWjdGyY6eSeSN-3NLtmGi6bg8Jea0hf-FqgjNsy3lDNAtCT6OPEDT6rz2yPIMEDJRKvdoD-JcuPokZ4lpBqop6a-SW9Q2JJLvwDZzA`);
          });
        },
      },
    },
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
