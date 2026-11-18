import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  server: {
    port: 5174,
    host: '127.0.0.1',
  },
  preview: {
    port: 5174,
    host: '127.0.0.1',
  },
})
