import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Replace Node.js event emitter with our browser-compatible version
      events: '/src/lib/utils/EventEmitter.ts'
    }
  },
  optimizeDeps: {
    exclude: ['rcon-client']
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
});
