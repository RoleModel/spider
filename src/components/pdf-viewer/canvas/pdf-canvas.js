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
    this.isScrolling = false
    this.scrollTimeout = null
  }

  async updated(changedProperties) {
    if (this.context?.pdfDoc) {
      const needsRerender = changedProperties.has('context') && (
        !changedProperties.get('context')?.pdfDoc ||
        changedProperties.get('context')?.scale !== this.context.scale
      )

      if (needsRerender || this.pages.length === 0) {
        await this.loadPages()
      }
    }

    if (changedProperties.has('context') && this.context?.currentPage) {
      const oldContext = changedProperties.get('context')
      if (oldContext?.currentPage !== this.context.currentPage && !this.isScrolling) {
        setTimeout(() => this.scrollToPage(this.context.currentPage), 100)
      }
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
    const pageElements = this.shadowRoot.querySelectorAll('pdf-page')
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

      const pageElements = this.shadowRoot.querySelectorAll('pdf-page')
      let currentPage = 1

      for (const pageElement of pageElements) {
        const rect = pageElement.getBoundingClientRect()
        if (rect.top <= centerY && rect.bottom >= centerY) {
          currentPage = pageElement.pageNumber
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
      <div class="canvas-container">
        ${this.pages.map(({ page, pageNumber }) => html`
          <pdf-page
            .page=${page}
            .scale=${this.context?.scale || 1}
            .pageNumber=${pageNumber}>
          </pdf-page>
        `)}
      </div>
    `
  }
}

customElements.define('pdf-canvas', PDFCanvas)

