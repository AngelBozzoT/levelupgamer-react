import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/" // 👈 CAMBIADO A "/" PARA QUE VERCEL ENCUENTRE LOS ASSETS EN LA RAÍZ DE COMPILACIÓN
})