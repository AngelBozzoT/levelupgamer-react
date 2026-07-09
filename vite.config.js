import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./" // 👈 ESTA LÍNEA OBLIGA A VITE A USAR RUTAS RELATIVAS CORRECTAS EN CUALQUIER HOSTING
})