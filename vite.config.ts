import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/VroomSocial/' : '/',
  define: {
    BASENAME: JSON.stringify(process.env.NODE_ENV === 'production' ? '/VroomSocial' : '/'),
  },
  server: {
    port: 9077,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});