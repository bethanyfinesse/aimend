import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/aimend/',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
    include: ['react', 'react-dom', 'react-router-dom', 'recharts', 'mathjs', '@monaco-editor/react', 'lucide-react'],
  },
})
