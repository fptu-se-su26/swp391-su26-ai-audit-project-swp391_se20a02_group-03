import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // TK-042: base '/' để asset nạp đúng trên Vercel (domain gốc) và SPA router không bị 404.
  base: '/',
  server: {
    watch: {
      // Exclude Visual Studio lock files to prevent EBUSY errors
      ignored: ['**/.vs/**'],
    },
  },
})
