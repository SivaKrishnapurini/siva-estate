import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:4000/',
        changeOrigin: true,
        secure: false,
      },
      '/listing': {
        target: 'http://localhost:4000/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
