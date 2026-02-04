import { html, LitElement } from 'lit'
import * as pdfjsLib from 'pdfjs-dist'
import styles from './rm-pdf-page.styles.js'

export default class PDFPage extends LitElement {
  static get styles() {
    return styles
  }

  static get properties() {
    return {
      page: { type: Object },
      scale: { type: Number },
      pageNumber: { type: Number }
    }
  }

  constructor() {
    super()
    this.page = null
    this.scale = 1
    this.pageNumber = 1
    this._renderTask = null
  }

  async updated(changedProperties) {
    if (this.page && (changedProperties.has('page') || changedProperties.has('scale'))) {
      await this.renderPage()
    }
  }

  async renderPage() {
    if (!this.page) return

    this.#cancelRenderTask()

    const viewport = this.page.getViewport({ scale: this.scale })
    const devicePixelRatio = window.devicePixelRatio || 1

    const pageWrapper = this.shadowRoot.querySelector('.page-wrapper')
    if (!pageWrapper) return

    pageWrapper.style.width = `${viewport.width}px`
    pageWrapper.style.height = `${viewport.height}px`

    const canvas = this.shadowRoot.querySelector('canvas')
    const canvasContext = canvas.getContext('2d')

    canvas.height = viewport.height * devicePixelRatio
    canvas.width = viewport.width * devicePixelRatio
    canvas.style.width = `${viewport.width}px`
    canvas.style.height = `${viewport.height}px`

    const scaledViewport = this.page.getViewport({ scale: this.scale * devicePixelRatio })

    this._renderTask = this.page.render({
      canvasContext,
      viewport: scaledViewport
    })

    await this._renderTask.promise
    this._renderTask = null

    const textLayerDiv = this.shadowRoot.querySelector('.textLayer')
    textLayerDiv.style.width = `${viewport.width}px`
    textLayerDiv.style.height = `${viewport.height}px`
    textLayerDiv.innerHTML = ''

    await this.renderTextLayer(viewport, textLayerDiv)
  }

  async renderTextLayer(viewport, textLayerDiv) {
    try {
      const textContent = await this.page.getTextContent()

      textContent.items.forEach((textItem) => {
        const tx = pdfjsLib.Util.transform(
          viewport.transform,
          textItem.transform
        )

        const fontSize = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]))
        const fontHeight = fontSize

        const textDiv = document.createElement('div')
        textDiv.style.position = 'absolute'
        textDiv.style.left = `${tx[4]}px`
        textDiv.style.top = `${tx[5] - fontHeight}px`
        textDiv.style.fontSize = `${fontSize}px`
        textDiv.style.fontFamily = textItem.fontName || 'sans-serif'

        if (textItem.str.length > 0) {
          const width = textItem.width * viewport.scale
          textDiv.style.width = `${width}px`
        }

        textDiv.textContent = textItem.str

        textLayerDiv.appendChild(textDiv)
      })
    } catch (error) {
      console.error('Error rendering text layer:', error)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.#cancelRenderTask()
  }

  render() {
    return html`
      <div class="page-wrapper">
        <canvas data-page-number="${this.pageNumber}"></canvas>
        <div class="textLayer"></div>
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

customElements.define('rm-pdf-page', PDFPage)
