import { LitElement, html } from 'lit'
import { ContextConsumer } from '@lit/context'
import styles from './pdf-sidebar.styles.js'
import { pdfContext } from '../pdf-context.js'
import '../thumbnail/pdf-thumbnail.js'


export default class PDFSidebar extends LitElement {
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

  renderThumbnails() {
    if (!this.context?.pdfDoc) return html``

    const { pdfDoc, totalPages, currentPage } = this.context

    if (!pdfDoc || totalPages === 0) return html``

    const thumbnails = []
    for (let i = 1; i <= totalPages; i++) {
      thumbnails.push(html`
        <pdf-thumbnail
          .pageNumber="${i}"
          .pdfDoc="${pdfDoc}"
          .isActive="${i === currentPage}"
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

