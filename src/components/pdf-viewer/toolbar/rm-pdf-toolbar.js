import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './rm-pdf-toolbar.styles.js'
import closeIcon from '../../../assets/icons/close.svg'
import closeSidebarIcon from '../../../assets/icons/close-sidebar.svg'
import openSidebarIcon from '../../../assets/icons/open-sidebar.svg'
import arrowLeftIcon from '../../../assets/icons/arrow-left.svg'
import arrowRightIcon from '../../../assets/icons/arrow-right.svg'
import printIcon from '../../../assets/icons/print.svg'
import downloadIcon from '../../../assets/icons/download.svg'
import zoomOutIcon from '../../../assets/icons/zoom-out.svg'
import zoomInIcon from '../../../assets/icons/zoom-in.svg'

export default class PDFToolbar extends PDFViewerComponent {
  static get styles() {
    return styles
  }

  previousPage() {
    this.context?.previousPage()
  }

  nextPage() {
    this.context?.nextPage()
  }

  zoomIn() {
    this.context?.zoomIn()
  }

  zoomOut() {
    this.context?.zoomOut()
  }

  print() {
    this.context?.print()
  }

  download() {
    this.context?.download()
  }

  toggleSidebar() {
    this.context?.toggleSidebar()
  }

  render() {
    if (!this.context) return html``

    const { currentPage, totalPages, scale, sidebarCollapsed } = this.context

    return html`
      <div class="toolbar">
        <div class="toolbar__section">
          <button class="btn--icon sidebar-toggle ${sidebarCollapsed ? 'collapsed' : ''}" @click="${this.toggleSidebar}">
            <img src=${openSidebarIcon} alt="Toggle sidebar" class="icon-open" />
            <img src=${closeSidebarIcon} alt="Toggle sidebar" class="icon-close" />
          </button>
          
          <div class="toolbar__section-group">
            <button class="btn--icon" @click="${this.previousPage}" ?disabled="${currentPage <= 1}">
              <img src=${arrowLeftIcon} alt="Previous" />
            </button>
            <span class="page-info">
              Page ${currentPage} of ${totalPages}
            </span>
            <button class="btn--icon" @click="${this.nextPage}" ?disabled="${currentPage >= totalPages}">
              <img src=${arrowRightIcon} alt="Next" />
            </button>
          </div>
          
          <div class="toolbar__section-group">
            <button class="btn--icon" @click="${this.zoomOut}" ?disabled="${scale <= 0.5}">
              <img src=${zoomOutIcon} alt="Zoom out" />
            </button>
            <span class="zoom-level">${Math.round(scale * 100)}%</span>
            <button class="btn--icon" @click="${this.zoomIn}">
              <img src=${zoomInIcon} alt="Zoom in" />
            </button>
          </div>

          <div class="toolbar__section-group">
            <button class="btn--icon" @click="${this.print}">
              <img src=${printIcon} alt="Print" />
            </button>
            <button class="btn--icon" @click="${this.download}">
              <img src=${downloadIcon} alt="Download" />
            </button>
          </div>
        </div>
        
        <button class="btn--icon" @click="">
          <img src=${closeIcon} alt="Close" />
        </button>
      </div>
    `
  }
}

customElements.define('rm-pdf-toolbar', PDFToolbar)

