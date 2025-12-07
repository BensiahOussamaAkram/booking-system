import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Explicitly set the port (optional, defaults to 5173)
    port: 5173,
    
    // OPTIONAL: If you want to avoid CORS issues and hardcoded URLs in api.ts,
    // you can enable this proxy. If you do, change your API_URL in api.ts to just '/api'
    /*
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/bookings/stream': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
    */
  }
})