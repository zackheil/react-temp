import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/wsp': {
        target: 'https://zheil.requestcatcher.com',
        changeOrigin: true,
      },
    },
  },
});
