import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function copyToRootPlugin(): Plugin {
  return {
    name: 'copy-to-root',
    closeBundle() {
      try {
        const src = resolve(__dirname, 'dist')
        const dest = resolve(__dirname, '../../dist')
        if (fs.existsSync(src)) {
          fs.mkdirSync(dest, { recursive: true })
          fs.cpSync(src, dest, { recursive: true })
          console.log(`[vite] Auto-synced build output to root dist: ${dest}`)
        }
      } catch (err) {
        console.warn('[vite] Failed to copy dist to root:', err)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyToRootPlugin()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      cursorix: resolve(__dirname, '../../packages/cursorix/src/index.ts'),
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
  },
})

