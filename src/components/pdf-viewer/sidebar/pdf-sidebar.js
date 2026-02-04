import { LitElement, html } from 'lit'
import styles from './pdf-sidebar.styles.js'
import '../thumbnail/pdf-thumbnail.js'

const PDFContext = Symbol('pdf-context')

export default class PDFSidebar extends LitElement {
  static get properties() {
    return {
      _currentPage: { type: Number, state: true },
      _totalPages: { type: Number, state: true }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this._currentPage = 1
    this._totalPages = 0
    this._context = null
  }

  connectedCallback() {
    super.connectedCallback()
    this._findContext()
    this.addEventListener('pdf-loaded', this._handleUpdate)
    this.addEventListener('page-change', this._handleUpdate)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('pdf-loaded', this._handleUpdate)
    this.removeEventListener('page-change', this._handleUpdate)
  }

  _findContext() {
    let node = this.parentElement
    while (node) {
      if (node.tagName === 'PDF-VIEWER' && node[PDFContext]) {
        this._context = node[PDFContext]
        this._updateFromContext()
        break
      }
      node = node.parentElement
    }
  }

  _updateFromContext() {
    if (!this._context) return
    this._currentPage = this._context.getCurrentPage()
    this._totalPages = this._context.getTotalPages()
  }

  _handleUpdate = () => {
    this._updateFromContext()
  }

  handleThumbnailClick(e) {
    this._context?.setCurrentPage(e.detail.pageNumber)
  }

  renderThumbnails() {
    if (!this._context) return html``
    const pdfDoc = this._context.getPdfDoc()
    if (!pdfDoc || this._totalPages === 0) return html``

    const thumbnails = []
    for (let i = 1; i <= this._totalPages; i++) {
      thumbnails.push(html`
        <pdf-thumbnail
          .pageNumber="${i}"
          .pdfDoc="${pdfDoc}"
          .isActive="${i === this._currentPage}"
          @thumbnail-click="${this.handleThumbnailClick}"
        ></pdf-thumbnail>
      `)
    }
    return thumbnails
  }

  render() {
    return html`
      <div class="sidebar">
        <div class="thumbnails-container">
          ${this.renderThumbnails()}
        </div>
      </div>
    `
  }
}

customElements.define('pdf-sidebar', PDFSidebar)

export { PDFContext }
