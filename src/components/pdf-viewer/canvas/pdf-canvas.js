import { LitElement, html } from 'lit'
import styles from './pdf-canvas.styles.js'

const PDFContext = Symbol('pdf-context')

export default class PDFCanvas extends LitElement {
  static get properties() {
    return {
      _currentPage: { type: Number, state: true },
      _scale: { type: Number, state: true }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this._currentPage = 1
    this._scale = 1.5
    this._context = null
  }

  connectedCallback() {
    super.connectedCallback()
    this._findContext()
    this.addEventListener('pdf-loaded', this._handlePDFLoaded)
    this.addEventListener('page-change', this._handlePageChange)
    this.addEventListener('scale-change', this._handleScaleChange)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('pdf-loaded', this._handlePDFLoaded)
    this.removeEventListener('page-change', this._handlePageChange)
    this.removeEventListener('scale-change', this._handleScaleChange)
  }

  _findContext() {
    let node = this.parentElement
    while (node) {
      if (node.tagName === 'PDF-VIEWER' && node[PDFContext]) {
        this._context = node[PDFContext]
        this._updateFromContext()
        break
      }
      node = node.parentElement
    }
  }

  _updateFromContext() {
    if (!this._context) return
    this._currentPage = this._context.getCurrentPage()
    this._scale = this._context.getScale()
  }

  _handlePDFLoaded = async () => {
    this._updateFromContext()
    await this.renderPage(this._currentPage)
  }

  _handlePageChange = async () => {
    this._updateFromContext()
    await this.renderPage(this._currentPage)
  }

  _handleScaleChange = async () => {
    this._updateFromContext()
    await this.renderPage(this._currentPage)
  }

  async firstUpdated() {
    if (this._context && this._context.getPdfDoc()) {
      await this.renderPage(this._currentPage)
    }
  }

  async renderPage(pageNumber) {
    if (!this._context) return
    const pdfDoc = this._context.getPdfDoc()
    if (!pdfDoc) return

    try {
      const page = await pdfDoc.getPage(pageNumber)
      const canvas = this.shadowRoot.querySelector('#pdf-canvas')
      if (!canvas) return

      const context = canvas.getContext('2d')
      const viewport = page.getViewport({ scale: this._scale })

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      await page.render(renderContext).promise
    } catch (error) {
      console.error('Error rendering page:', error)
    }
  }

  render() {
    return html`
      <div class="canvas-container">
        <canvas id="pdf-canvas"></canvas>
      </div>
    `
  }
}

customElements.define('pdf-canvas', PDFCanvas)

export { PDFContext }
