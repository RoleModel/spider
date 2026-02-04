import { LitElement, html } from 'lit'
import { ContextConsumer } from '@lit/context'
import styles from './pdf-canvas.styles.js'
import { pdfContext } from '../pdf-context.js'

export default class PDFCanvas extends LitElement {
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

  async updated(changedProperties) {
    await this.renderPage()
  }

  async renderPage() {
    if (!this.context?.pdfDoc) return

    const { pdfDoc, currentPage, scale } = this.context

    try {
      const page = await pdfDoc.getPage(currentPage)
      const canvas = this.shadowRoot.querySelector('#pdf-canvas')
      if (!canvas) return

      const canvasContext = canvas.getContext('2d')
      const viewport = page.getViewport({ scale })

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext,
        viewport
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

