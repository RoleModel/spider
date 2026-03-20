// Polyfill URL.parse for browsers that don't support it (Safari < 18.2, Chrome < 126).
// Required by pdfjs-dist v5+.
if (typeof URL.parse !== 'function') {
  URL.parse = function (url, base) {
    try {
      return new URL(url, base)
    } catch {
      return null
    }
  }
}
