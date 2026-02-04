import { LitElement, html } from 'lit'
import styles from './pdf-thumbnail.styles.js'

export default class PDFThumbnail extends LitElement {
  static get properties() {
    return {
      pageNumber: { type: Number },
      pdfDoc: { type: Object },
      scale: { type: Number },
      isActive: { type: Boolean }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this.pageNumber = 1
    this.pdfDoc = null
    this.scale = 0.3
    this.isActive = false
  }

  async firstUpdated() {
    await this.renderThumbnail()
  }

  async updated(changedProperties) {
    if (changedProperties.has('pdfDoc') || changedProperties.has('pageNumber')) {
      await this.renderThumbnail()
    }
  }

  async renderThumbnail() {
    if (!this.pdfDoc) return

    try {
      const page = await this.pdfDoc.getPage(this.pageNumber)
      const canvas = this.shadowRoot.querySelector('#thumbnail-canvas')
      if (!canvas) return

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
      console.error('Error rendering thumbnail:', error)
    }
  }

  handleClick() {
    this.dispatchEvent(new CustomEvent('thumbnail-click', {
      detail: { pageNumber: this.pageNumber },
      bubbles: true,
      composed: true
    }))
  }

  render() {
    return html`
      <div 
        class="thumbnail-container ${this.isActive ? 'active' : ''}"
        @click="${this.handleClick}"
      >
        <canvas id="thumbnail-canvas"></canvas>
        <div class="page-label">${this.pageNumber}</div>
      </div>
    `
  }
}

customElements.define('pdf-thumbnail', PDFThumbnail)
