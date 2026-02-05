import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/index.js'),
        'components/pdf-viewer/index': resolve(__dirname, 'src/components/pdf-viewer/index.js'),
      },
      formats: ['es']
    },
    rollupOptions: {
      external: ['lit', '@lit/context', 'pdfjs-dist'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  },
  worker: {
    format: 'es'
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  server: {
    fs: {
      strict: false
    }
  },
})
