import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom/client', 'react/jsx-runtime'],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
  },
});
