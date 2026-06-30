import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Certifique-se de importar o 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Força o roteador e qualquer outra biblioteca a usarem o mesmo React da sua raiz
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
})