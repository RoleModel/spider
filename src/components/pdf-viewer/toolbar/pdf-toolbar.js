import { LitElement, html } from 'lit'
import styles from './pdf-toolbar.styles.js'

const PDFContext = Symbol('pdf-context')

export default class PDFToolbar extends LitElement {
  static get properties() {
    return {
      _currentPage: { type: Number, state: true },
      _totalPages: { type: Number, state: true },
      _scale: { type: Number, state: true }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this._currentPage = 1
    this._totalPages = 0
    this._scale = 1.5
    this._context = null
  }

  connectedCallback() {
    super.connectedCallback()
    this._findContext()
    this.addEventListener('pdf-loaded', this._handleUpdate)
    this.addEventListener('page-change', this._handleUpdate)
    this.addEventListener('scale-change', this._handleUpdate)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('pdf-loaded', this._handleUpdate)
    this.removeEventListener('page-change', this._handleUpdate)
    this.removeEventListener('scale-change', this._handleUpdate)
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
    this._scale = this._context.getScale()
  }

  _handleUpdate = () => {
    this._updateFromContext()
  }

  previousPage() {
    this._context?.previousPage()
  }

  nextPage() {
    this._context?.nextPage()
  }

  zoomIn() {
    this._context?.zoomIn()
  }

  zoomOut() {
    this._context?.zoomOut()
  }

  render() {
    return html`
      <div class="toolbar">
        <button @click="${this.previousPage}" ?disabled="${this._currentPage <= 1}">
          Previous
        </button>
        <span class="page-info">
          Page ${this._currentPage} of ${this._totalPages}
        </span>
        <button @click="${this.nextPage}" ?disabled="${this._currentPage >= this._totalPages}">
          Next
        </button>
        <div class="zoom-controls">
          <button @click="${this.zoomOut}" ?disabled="${this._scale <= 0.5}">
            Zoom Out
          </button>
          <span class="zoom-level">${Math.round(this._scale * 100)}%</span>
          <button @click="${this.zoomIn}">
            Zoom In
          </button>
        </div>
      </div>
    `
  }
}

customElements.define('pdf-toolbar', PDFToolbar)

export { PDFContext }
