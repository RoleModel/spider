import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './pdf-sidebar.styles.js'
import '../thumbnail/pdf-thumbnail.js'


export default class PDFSidebar extends PDFViewerComponent {
  static get styles() {
    return styles
  }

  renderThumbnails() {
    if (!this.context?.pdfDoc) return html``

    const { totalPages } = this.context

    if (totalPages === 0) return html``

    const thumbnails = []
    for (let i = 1; i <= totalPages; i++) {
      thumbnails.push(html`
        <pdf-thumbnail
          .pageNumber="${i}"
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

