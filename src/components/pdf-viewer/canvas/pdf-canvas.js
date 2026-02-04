import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './pdf-canvas.styles.js'

export default class PDFCanvas extends PDFViewerComponent {
  static get styles() {
    return styles
  }

  static get properties() {
    return {
      renderedPages: { type: Number, state: true }
    }
  }

  constructor() {
    super()
    this.renderedPages = 0
    this.isScrolling = false
    this.scrollTimeout = null
  }

  async updated(changedProperties) {
    if (this.context?.pdfDoc) {
      const needsRerender = changedProperties.has('context') && (
        !changedProperties.get('context')?.pdfDoc ||
        changedProperties.get('context')?.scale !== this.context.scale
      )

      if (needsRerender || this.renderedPages === 0) {
        await this.renderAllPages()
      }
    }

    if (changedProperties.has('context') && this.context?.currentPage) {
      const oldContext = changedProperties.get('context')
      if (oldContext?.currentPage !== this.context.currentPage && !this.isScrolling) {
        setTimeout(() => this.scrollToPage(this.context.currentPage), 100)
      }
    }
  }

  async renderAllPages() {
    if (!this.context?.pdfDoc) return

    const { pdfDoc, totalPages, scale } = this.context
    const container = this.shadowRoot.querySelector('.canvas-container')
    if (!container) return

    container.innerHTML = ''

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum)
        const viewport = page.getViewport({ scale })

        const pageWrapper = document.createElement('div')
        pageWrapper.className = 'page-wrapper'

        const canvas = document.createElement('canvas')
        const canvasContext = canvas.getContext('2d')

        canvas.height = viewport.height
        canvas.width = viewport.width
        canvas.dataset.pageNumber = pageNum

        await page.render({
          canvasContext,
          viewport
        }).promise

        pageWrapper.appendChild(canvas)
        container.appendChild(pageWrapper)
      } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error)
      }
    }

    this.renderedPages = totalPages
  }

  scrollToPage(pageNum) {
    const container = this.shadowRoot.querySelector('.canvas-container')
    const canvas = this.shadowRoot.querySelector(`canvas[data-page-number="${pageNum}"]`)

    if (container && canvas) {
      const containerTop = container.getBoundingClientRect().top
      const canvasTop = canvas.getBoundingClientRect().top
      const offset = canvasTop - containerTop + container.scrollTop - 32

      container.scrollTo({
        top: offset,
        behavior: 'smooth'
      })
    }
  }

  handleScroll() {
    if (!this.context?.setCurrentPage) return

    this.isScrolling = true
    clearTimeout(this.scrollTimeout)

    this.scrollTimeout = setTimeout(() => {
      const container = this.shadowRoot.querySelector('.canvas-container')
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const centerY = containerRect.top + containerRect.height / 2

      const canvases = this.shadowRoot.querySelectorAll('canvas')
      let currentPage = 1

      for (const canvas of canvases) {
        const rect = canvas.getBoundingClientRect()
        if (rect.top <= centerY && rect.bottom >= centerY) {
          currentPage = parseInt(canvas.dataset.pageNumber, 10)
          break
        }
      }

      if (currentPage !== this.context.currentPage) {
        this.context.setCurrentPage(currentPage)
      }

      this.isScrolling = false
    }, 150)
  }

  firstUpdated() {
    const container = this.shadowRoot.querySelector('.canvas-container')
    if (container) {
      container.addEventListener('scroll', () => this.handleScroll())
    }
  }

  render() {
    return html`
      <div class="canvas-container"></div>
    `
  }
}

customElements.define('pdf-canvas', PDFCanvas)

