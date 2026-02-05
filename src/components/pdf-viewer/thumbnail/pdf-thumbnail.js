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
    this._renderTask = null
  }

  async firstUpdated() {
    await this.renderThumbnail()
  }

  async renderThumbnail() {
    if (!this.context?.pdfDoc) return

    this.#cancelRenderTask()

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

      this._renderTask = page.render(renderContext)
      await this._renderTask.promise
      this._renderTask = null
    } catch (error) {
      if (error.name !== 'RenderingCancelledException') {
        console.error('Error rendering thumbnail:', error)
      }
      this._renderTask = null
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.#cancelRenderTask()
  }

  handleClick() {
    this.context?.setShouldScroll(true)
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

  #cancelRenderTask() {
    if (this._renderTask) {
      this._renderTask.cancel()
      this._renderTask = null
    }
  }
}

customElements.define('rm-pdf-thumbnail', PDFThumbnail)
