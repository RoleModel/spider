import { LitElement, html } from 'lit'
import { ContextConsumer } from '@lit/context'
import styles from './pdf-toolbar.styles.js'
import { pdfContext } from '../pdf-context.js'

export default class PDFToolbar extends LitElement {
  static get styles() {
    return styles
  }

  constructor() {
    super()
    this._contextConsumer = new ContextConsumer(this, {
      context: pdfContext,
      callback: (value) => {
        this.context = value
        this.requestUpdate()
      },
      subscribe: true
    })
    this.context = null
  }

  previousPage() {
    this.context?.previousPage()
  }

  nextPage() {
    this.context?.nextPage()
  }

  zoomIn() {
    this.context?.zoomIn()
  }

  zoomOut() {
    this.context?.zoomOut()
  }

  render() {
    if (!this.context) return html``

    const { currentPage, totalPages, scale } = this.context

    return html`
      <div class="toolbar">
        <button @click="${this.previousPage}" ?disabled="${currentPage <= 1}">
          Previous
        </button>
        <span class="page-info">
          Page ${currentPage} of ${totalPages}
        </span>
        <button @click="${this.nextPage}" ?disabled="${currentPage >= totalPages}">
          Next
        </button>
        <div class="zoom-controls">
          <button @click="${this.zoomOut}" ?disabled="${scale <= 0.5}">
            Zoom Out
          </button>
          <span class="zoom-level">${Math.round(scale * 100)}%</span>
          <button @click="${this.zoomIn}">
            Zoom In
          </button>
        </div>
      </div>
    `
  }
}

customElements.define('pdf-toolbar', PDFToolbar)

