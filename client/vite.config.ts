import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// This is the standard Vite + React + Tailwind v4 config
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // This ensures it doesn't get blocked by the browser
    host: true,
    port: 5173,
  }
})
