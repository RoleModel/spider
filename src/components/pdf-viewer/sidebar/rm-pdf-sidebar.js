import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './rm-pdf-sidebar.styles.js'
import '../thumbnail/rm-pdf-thumbnail.js'

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
      <div class="sidebar ${sidebarCollapsed ? 'collapsed' : ''}">
        <div class="thumbnails-container">
          ${this.renderThumbnails()}
        </div>
      </div>
    `
  }
}

customElements.define('rm-pdf-sidebar', PDFSidebar)

