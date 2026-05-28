import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Exclude Visual Studio lock files to prevent EBUSY errors
      ignored: ['**/.vs/**'],
    },
  },
})
