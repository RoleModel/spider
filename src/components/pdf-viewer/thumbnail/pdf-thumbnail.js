import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './pdf-thumbnail.styles.js'

export default class PDFThumbnail extends PDFViewerComponent {
  static get properties() {
    return {
      pageNumber: { type: Number }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this.pageNumber = 1
    this.scale = 0.3
  }

  async firstUpdated() {
    await this.renderThumbnail()
  }

  async updated(changedProperties) {
    if (changedProperties.has('pageNumber')) {
      await this.renderThumbnail()
    }
    if (this.context?.pdfDoc) {
      await this.renderThumbnail()
    }
  }

  async renderThumbnail() {
    if (!this.context?.pdfDoc) return

    const pdfDoc = this.context.pdfDoc

    try {
      const page = await pdfDoc.getPage(this.pageNumber)
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
    console.log('Thumbnail clicked:', this.pageNumber)
    this.context?.setCurrentPage(this.pageNumber)
  }

  render() {
    const isActive = this.context?.currentPage === this.pageNumber

    return html`
      <div 
        class="thumbnail-container ${isActive ? 'active' : ''}"
        @click="${this.handleClick}"
      >
        <canvas id="thumbnail-canvas"></canvas>
        <div class="page-label">${this.pageNumber}</div>
      </div>
    `
  }
}

customElements.define('pdf-thumbnail', PDFThumbnail)
