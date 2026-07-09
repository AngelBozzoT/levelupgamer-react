import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // ← Asegúrate de que diga @vitejs/plugin-react

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/levelupgamer-react/',
})