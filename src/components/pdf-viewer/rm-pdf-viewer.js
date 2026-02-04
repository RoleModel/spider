import { LitElement, html } from 'lit'
import { ContextProvider } from '@lit/context'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import styles from './rm-pdf-viewer.styles.js'
import { pdfContext } from './pdf-context.js'
import './toolbar/rm-pdf-toolbar.js'
import './sidebar/rm-pdf-sidebar.js'
import './canvas/rm-pdf-canvas.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker


export default class PDFViewer extends LitElement {
  static get properties() {
    return {
      src: { type: String },
      pdfDoc: { type: Object, state: true },
      currentPage: { type: Number, state: true },
      totalPages: { type: Number, state: true },
      scale: { type: Number, state: true }
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

    this._provider = new ContextProvider(this, {
      context: pdfContext,
      initialValue: this._createContextValue()
    })
  }

  _createContextValue() {
    return {
      pdfDoc: this.pdfDoc,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      scale: this.scale,
      setCurrentPage: (page) => {
        console.log('setCurrentPage', page)
        this.currentPage = page
      },
      setScale: (scale) => {
        this.scale = scale
      },
      nextPage: () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++
        }
      },
      previousPage: () => {
        if (this.currentPage > 1) {
          this.currentPage--
        }
      },
      zoomIn: () => {
        this.scale += 0.25
      },
      zoomOut: () => {
        if (this.scale > 0.5) {
          this.scale -= 0.25
        }
      }
    }
  }

  updated(changedProperties) {
    if (
      changedProperties.has('pdfDoc') ||
      changedProperties.has('currentPage') ||
      changedProperties.has('totalPages') ||
      changedProperties.has('scale')
    ) {
      console.log('setting value', this._createContextValue())
      this._provider.setValue(this._createContextValue())
    }

    if (changedProperties.has('src') && this.src) {
      this.loadPDF()
    }
  }

  async firstUpdated() {
    if (this.src) {
      await this.loadPDF()
    }
  }

  async loadPDF() {
    if (!this.src) return

    try {
      const loadingTask = pdfjsLib.getDocument(this.src)
      this.pdfDoc = await loadingTask.promise
      this.totalPages = this.pdfDoc.numPages
      this.currentPage = 1
    } catch (error) {
      console.error('Error loading PDF:', error)
    }
  }

  render() {
    return html`
      <div class="pdf-viewer-container">
        <rm-pdf-toolbar></rm-pdf-toolbar>
        <div class="content-container">
          <rm-pdf-sidebar></rm-pdf-sidebar>
          <rm-pdf-canvas></rm-pdf-canvas>
        </div>
      </div>
    `
  }
}

customElements.define('rm-pdf-viewer', PDFViewer)

