import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './pdf-sidebar.styles.js'
import '../thumbnail/pdf-thumbnail.js'

export default class PDFSidebar extends PDFViewerComponent {
  static get styles() {
    return styles
  }

  static get properties() {
    return {
      _lastScrolledPage: { type: Number, state: true }
    }
  }

  constructor() {
    super()
    this._lastScrolledPage = 1
    this._needsScroll = false
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties)

    if (this.context?.currentPage !== this._lastScrolledPage) {
      this._lastScrolledPage = this.context.currentPage
      this._needsScroll = true
    }
  }

  updated() {
    if (this._needsScroll) {
      this._needsScroll = false
      this.scrollToActiveThumbnail()
    }
  }

  scrollToActiveThumbnail() {
    const container = this.shadowRoot.querySelector('.thumbnails-container')
    const thumbnails = this.shadowRoot.querySelectorAll('rm-pdf-thumbnail')
    const activeThumbnail = Array.from(thumbnails).find(
      thumb => thumb.pageNumber === this.context.currentPage
    )

    if (container && activeThumbnail) {
      const containerRect = container.getBoundingClientRect()
      const thumbnailRect = activeThumbnail.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerBottom = containerRect.bottom
      const thumbnailTop = thumbnailRect.top
      const thumbnailBottom = thumbnailRect.bottom

      if (thumbnailTop < containerTop || thumbnailBottom > containerBottom) {
        const offset = activeThumbnail.offsetTop - (container.clientHeight / 2) + (thumbnailRect.height / 2)

        container.scrollTo({
          top: offset,
          behavior: 'smooth'
        })
      }
    }
  }

  renderThumbnails() {
    if (!this.context?.pdfDoc) return html``

    const { totalPages } = this.context

    if (totalPages === 0) return html``

    const thumbnails = []
    for (let i = 1; i <= totalPages; i++) {
      thumbnails.push(html`
        <rm-pdf-thumbnail
          .pageNumber="${i}"
        ></rm-pdf-thumbnail>
      `)
    }
    return thumbnails
  }

  render() {
    if (!this.context) return html``

    const { sidebarCollapsed } = this.context

    return html`
      <div class="sidebar-container">
        <div class="sidebar ${sidebarCollapsed ? 'collapsed' : ''}">
          <div class="thumbnails-container">
            ${this.renderThumbnails()}
          </div>
        </div>
      </div>
    `
  }
}

customElements.define('rm-pdf-sidebar', PDFSidebar)

