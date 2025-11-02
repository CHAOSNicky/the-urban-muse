import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // server: {
  //   host: true,          // or '0.0.0.0'
  //   port: 5173,
  //   // optional: helps HMR on phone
  //   hmr: { host: '192.168.1.23' } // put your laptop IP here
  // }
})
