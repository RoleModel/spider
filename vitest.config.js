import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.styles.js',
        '**/theme-config.js',
        'vite.config.js',
        'vitest.config.js'
      ]
    },
    setupFiles: ['./test/setup.js']
  },
  resolve: {
    alias: {
      'pdfjs-dist/build/pdf.worker.mjs': resolve(__dirname, 'test/mocks/pdf.worker.mock.js')
    }
  }
})
