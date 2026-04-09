import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    host: true, // Expose to all network interfaces
    allowedHosts: [
      'localhost',
      'compacted-oink-repaint.ngrok-free.dev', // Your ngrok URL
      '.ngrok-free.dev'  // Allow ALL ngrok free domains (wildcard)
    ]
    }
})


