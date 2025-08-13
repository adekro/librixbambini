import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Configurazione Vite per React + Vercel
export default defineConfig({
  plugins: [react()],
  
  // Evita problemi di path relativi in produzione
  base: './',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // alias per import più puliti
    },
  },

  build: {
    outDir: 'dist', // cartella di output
    sourcemap: true, // utile per debug anche in produzione
    chunkSizeWarningLimit: 1000, // evita warning se bundle grande
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'], // spezza in più chunk per migliorare caricamento
        },
      },
    },
  },

  server: {
    port: 5173, // porta locale
    open: true, // apre il browser automaticamente
  },

  preview: {
    port: 4173, // porta preview build
    strictPort: true,
  },
})
