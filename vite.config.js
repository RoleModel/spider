export default {
  optimizeDeps: {
    exclude: ['pdfjs-dist']
  },
  server: {
    fs: {
      strict: false
    }
  },
  worker: {
    format: 'es'
  }
}
