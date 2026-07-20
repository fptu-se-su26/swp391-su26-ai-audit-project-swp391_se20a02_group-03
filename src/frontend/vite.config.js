import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // TK-042: base '/' để asset nạp đúng trên Vercel (domain gốc) và SPA router không bị 404.
  base: '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/html5-qrcode')) return 'html5-qrcode-scanner'
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) return 'leaflet'
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor'
          if (id.includes('/pages/matchpro/')) return 'matchpro-pages'
          if (id.includes('/pages/owner/')) return 'owner-pages'
          if (id.includes('/pages/admin/')) return 'admin-pages'
        },
      },
    },
  },
  server: {
    watch: {
      // Exclude Visual Studio lock files to prevent EBUSY errors
      ignored: ['**/.vs/**'],
    },
  },
})
