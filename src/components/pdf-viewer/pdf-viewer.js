import { LitElement, html } from 'lit'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import styles from './pdf-viewer.styles.js'

// Configure the worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default class PDFViewer extends LitElement {
  static get properties() {
    return {
      src: { type: String },
      currentPage: { type: Number },
      totalPages: { type: Number },
      scale: { type: Number }
    }
  }

  static get styles() {
    return styles;
  }

  constructor() {
    super()
    this.src = ''
    this.currentPage = 1
    this.totalPages = 0
    this.scale = 1.5
    this.pdfDoc = null
  }

  async firstUpdated() {
    if (this.src) {
      await this.loadPDF()
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('src') && this.src) {
      this.loadPDF()
    }
  }

  async loadPDF() {
    if (!this.src) return

    try {
      const loadingTask = pdfjsLib.getDocument(this.src)
      this.pdfDoc = await loadingTask.promise
      this.totalPages = this.pdfDoc.numPages
      this.currentPage = 1
      await this.renderPage(this.currentPage)
    } catch (error) {
      console.error('Error loading PDF:', error)
    }
  }

  async renderPage(pageNumber) {
    if (!this.pdfDoc) return

    try {
      const page = await this.pdfDoc.getPage(pageNumber)
      const canvas = this.shadowRoot.querySelector('#pdf-canvas')
      const context = canvas.getContext('2d')

      const viewport = page.getViewport({ scale: this.scale })
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

  previousPage() {
    if (this.currentPage <= 1) return
    this.currentPage--
    this.renderPage(this.currentPage)
  }

  nextPage() {
    if (this.currentPage >= this.totalPages) return
    this.currentPage++
    this.renderPage(this.currentPage)
  }

  zoomIn() {
    this.scale += 0.25
    this.renderPage(this.currentPage)
  }

  zoomOut() {
    if (this.scale <= 0.5) return
    this.scale -= 0.25
    this.renderPage(this.currentPage)
  }

  render() {
    return html`
      <div class="pdf-viewer-container">
        <div class="toolbar">
          <button @click="${this.previousPage}" ?disabled="${this.currentPage <= 1}">
            Previous
          </button>
          <span class="page-info">
            Page ${this.currentPage} of ${this.totalPages}
          </span>
          <button @click="${this.nextPage}" ?disabled="${this.currentPage >= this.totalPages}">
            Next
          </button>
          <div class="zoom-controls">
            <button @click="${this.zoomOut}" ?disabled="${this.scale <= 0.5}">
              Zoom Out
            </button>
            <span class="zoom-level">${Math.round(this.scale * 100)}%</span>
            <button @click="${this.zoomIn}">
              Zoom In
            </button>
          </div>
        </div>
        <div class="canvas-container">
          <canvas id="pdf-canvas"></canvas>
        </div>
      </div>
    `
  }
}

customElements.define('pdf-viewer', PDFViewer);

