import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/crm/api/v1': {
        target: 'http://localhost:7777',
        changeOrigin: true,
      },
    },
  },
})
