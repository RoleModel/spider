import { LitElement, html } from 'lit'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import styles from './pdf-viewer.styles.js'
import './toolbar/pdf-toolbar.js'
import './sidebar/pdf-sidebar.js'
import './canvas/pdf-canvas.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const PDFContext = Symbol('pdf-context')

export default class PDFViewer extends LitElement {
  static get properties() {
    return {
      src: { type: String }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this.src = ''
    this.pdfDoc = null
    this.currentPage = 1
    this.totalPages = 0
    this.scale = 1.5

    this[PDFContext] = {
      getPdfDoc: () => this.pdfDoc,
      getCurrentPage: () => this.currentPage,
      getTotalPages: () => this.totalPages,
      getScale: () => this.scale,
      setCurrentPage: (page) => {
        this.currentPage = page
        this.requestUpdate()
        this.dispatchEvent(new CustomEvent('page-change', {
          detail: { pageNumber: page },
          bubbles: true,
          composed: true
        }))
      },
      setScale: (scale) => {
        this.scale = scale
        this.requestUpdate()
        this.dispatchEvent(new CustomEvent('scale-change', {
          detail: { scale },
          bubbles: true,
          composed: true
        }))
      },
      nextPage: () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++
          this.requestUpdate()
          this.dispatchEvent(new CustomEvent('page-change', {
            detail: { pageNumber: this.currentPage },
            bubbles: true,
            composed: true
          }))
        }
      },
      previousPage: () => {
        if (this.currentPage > 1) {
          this.currentPage--
          this.requestUpdate()
          this.dispatchEvent(new CustomEvent('page-change', {
            detail: { pageNumber: this.currentPage },
            bubbles: true,
            composed: true
          }))
        }
      },
      zoomIn: () => {
        this.scale += 0.25
        this.requestUpdate()
        this.dispatchEvent(new CustomEvent('scale-change', {
          detail: { scale: this.scale },
          bubbles: true,
          composed: true
        }))
      },
      zoomOut: () => {
        if (this.scale > 0.5) {
          this.scale -= 0.25
          this.requestUpdate()
          this.dispatchEvent(new CustomEvent('scale-change', {
            detail: { scale: this.scale },
            bubbles: true,
            composed: true
          }))
        }
      }
    }
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
      this.requestUpdate()
      this.dispatchEvent(new CustomEvent('pdf-loaded', {
        detail: {
          totalPages: this.totalPages,
          pdfDoc: this.pdfDoc
        },
        bubbles: true,
        composed: true
      }))
    } catch (error) {
      console.error('Error loading PDF:', error)
      this.dispatchEvent(new CustomEvent('pdf-error', {
        detail: { error },
        bubbles: true,
        composed: true
      }))
    }
  }

  render() {
    return html`
      <div class="pdf-viewer-container">
        <pdf-toolbar></pdf-toolbar>
        <div class="content-container">
          <pdf-sidebar></pdf-sidebar>
          <pdf-canvas></pdf-canvas>
        </div>
      </div>
    `
  }
}

customElements.define('pdf-viewer', PDFViewer)

export { PDFContext }
