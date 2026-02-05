import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './pdf-canvas.styles.js'
import '../page/pdf-page.js'

export default class PDFCanvas extends PDFViewerComponent {
  static get styles() {
    return styles
  }

  static get properties() {
    return {
      pages: { type: Array, state: true }
    }
  }

  constructor() {
    super()
    this.pages = []
    this.scrollTimeout = null
  }

  async updated() {
    if (this.context?.pdfDoc && this.pages.length === 0) {
      await this.loadPages()
    }

    if (this.context?.shouldScroll) {
      this.scrollToPage(this.context.currentPage)
    }
  }

  async loadPages() {
    if (!this.context?.pdfDoc) return

    const { pdfDoc, totalPages } = this.context
    const pages = []

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        const page = await pdfDoc.getPage(pageNum)
        pages.push({ page, pageNumber: pageNum })
      } catch (error) {
        console.error(`Error loading page ${pageNum}:`, error)
      }
    }

    this.pages = pages
  }

  scrollToPage(pageNum) {
    const container = this.shadowRoot.querySelector('.canvas-container')
    const pageElements = this.shadowRoot.querySelectorAll('rm-pdf-page')
    const targetPage = Array.from(pageElements).find(
      el => el.pageNumber === pageNum
    )

    if (container && targetPage) {
      const containerTop = container.getBoundingClientRect().top
      const pageTop = targetPage.getBoundingClientRect().top
      const offset = pageTop - containerTop + container.scrollTop - 32

      container.scrollTo({
        top: offset,
        behavior: 'smooth'
      })

      this.context?.setShouldScroll(false)
    }
  }

  handleScroll() {
    if (!this.context?.setCurrentPage) return

    clearTimeout(this.scrollTimeout)

    this.scrollTimeout = setTimeout(() => {
      const container = this.shadowRoot.querySelector('.canvas-container')
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const centerY = containerRect.top + containerRect.height / 2

      const pageElements = this.shadowRoot.querySelectorAll('rm-pdf-page')
      let currentPage = null

      for (const pageElement of pageElements) {
        const rect = pageElement.getBoundingClientRect()
        if (rect.top <= centerY && rect.bottom >= centerY) {
          currentPage = pageElement.pageNumber
          break
        }
      }

      if (currentPage !== this.context.currentPage) {
        this._contextCurrentPage = currentPage
        this.context.setCurrentPage(currentPage)
      }
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
      <div class="canvas-container">
        ${this.pages.map(({ page, pageNumber }) => html`
          <rm-pdf-page
            .page=${page}
            .scale=${this.context?.scale || 1}
            .pageNumber=${pageNumber}>
          </rm-pdf-page>
        `)}
      </div>
    `
  }
}

customElements.define('rm-pdf-canvas', PDFCanvas)

