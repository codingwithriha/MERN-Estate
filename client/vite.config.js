// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: "http://localhost:3000", // Only for development
        changeOrigin: true, 
        secure: false,
      },
    },
  },
  plugins: [react()],
})