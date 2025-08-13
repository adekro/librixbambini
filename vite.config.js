import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Imposta il base path a '/' per assicurare che gli asset
  // vengano caricati correttamente su Vercel.
  base: '/',
});
