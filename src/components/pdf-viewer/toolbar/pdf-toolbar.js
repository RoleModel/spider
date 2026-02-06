import { html } from 'lit'
import { unsafeSVG } from 'lit/directives/unsafe-svg.js'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './pdf-toolbar.styles.js'
import closeIcon from '../../../assets/icons/close.svg?raw'
import arrowUpIcon from '../../../assets/icons/arrow-up.svg?raw'
import arrowDownIcon from '../../../assets/icons/arrow-down.svg?raw'
import zoomOutIcon from '../../../assets/icons/zoom-out.svg?raw'
import zoomInIcon from '../../../assets/icons/zoom-in.svg?raw'
import searchIcon from '../../../assets/icons/search.svg?raw'
import printIcon from '../../../assets/icons/print.svg?raw'
import downloadIcon from '../../../assets/icons/download.svg?raw'
import closeSidebarIcon from '../../../assets/icons/close-sidebar.svg?raw'
import openSidebarIcon from '../../../assets/icons/open-sidebar.svg?raw'

export default class PDFToolbar extends PDFViewerComponent {
  static get styles() {
    return styles
  }

  static get properties() {
    return {
      searchOpen: { type: Boolean, state: true }
    }
  }

  constructor() {
    super()
    this.searchOpen = false
  }

  previousPage() {
    this.context?.setShouldScroll(true)
    this.context?.previousPage()
  }

  nextPage() {
    this.context?.setShouldScroll(true)
    this.context?.nextPage()
  }

  zoomIn() {
    this.context?.zoomIn()
  }

  zoomOut() {
    this.context?.zoomOut()
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen

    if (this.searchOpen) {
      this._focusSearchInput()
    } else {
      this._clearSearch()
    }
  }

  closeSearch() {
    this.searchOpen = false
    this._clearSearch()
  }

  toggleSidebar() {
    this.context?.toggleSidebar()
  }

  close() {
    this.context?.close()
  }

  print() {
    this.context?.print()
  }

  download() {
    this.context?.download()
  }

  handlePageInput(e) {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 1 && value <= this.context.totalPages) {
      this.context?.setShouldScroll(true)
      this.context?.setCurrentPage(value)
    }
  }

  handlePageKeydown(e) {
    if (e.key === 'Enter') {
      e.target.blur()
    }
  }

  handleSearchInput(e) {
    const term = e.target.value
    this.context?.search(term)
  }

  handleSearchKeydown(e) {
    if (e.key === 'Enter') {
      this.context?.nextMatch()
    } else if (e.key === 'Escape') {
      this.closeSearch()
    }
  }

  nextSearchMatch() {
    this.context?.nextMatch()
  }

  previousSearchMatch() {
    this.context?.previousMatch()
  }

  render() {
    if (!this.context) return html``

    const { currentPage, totalPages, scale, sidebarCollapsed, searchMatches, currentMatchIndex } = this.context

    const matchCount = searchMatches?.length || 0
    const matchDisplay = matchCount > 0 ? `${currentMatchIndex + 1} of ${matchCount}` : '0 of 0'

    return html`
      <div class="toolbar">
        <div class="toolbar__section">
          ${sidebarCollapsed ? html`
            <button class="btn--icon" @click="${this.toggleSidebar}" title="Open Sidebar">
              ${unsafeSVG(openSidebarIcon)}
            </button>
          ` : html`
            <button class="btn--icon" @click="${this.toggleSidebar}" title="Close Sidebar">
              ${unsafeSVG(closeSidebarIcon)}
            </button>
          `}

          <div class="toolbar__section-group">
            <button class="btn--icon" @click="${this.previousPage}" ?disabled="${currentPage <= 1}">
              ${unsafeSVG(arrowUpIcon)}
            </button>
            <span class="page-info">
              <input
                type="number"
                class="page-input"
                .value="${currentPage}"
                @change="${this.handlePageInput}"
                @keydown="${this.handlePageKeydown}"
                min="1"
                max="${totalPages}"
              /> of ${totalPages}
            </span>
            <button class="btn--icon" @click="${this.nextPage}" ?disabled="${currentPage >= totalPages}">
              ${unsafeSVG(arrowDownIcon)}
            </button>
          </div>
        </div>

        <div class="toolbar__section">
          <div class="toolbar__section-group">
            <button class="btn--icon" @click="${this.zoomOut}" ?disabled="${scale <= 0.5}">
              ${unsafeSVG(zoomOutIcon)}
            </button>
            <span class="zoom-level">${Math.round(scale * 100)}%</span>
            <button class="btn--icon" @click="${this.zoomIn}">
              ${unsafeSVG(zoomInIcon)}
            </button>
          </div>
        </div>

        <div class="toolbar__section">
          <button class="btn--icon" @click="${this.toggleSearch}">
            ${unsafeSVG(searchIcon)}
          </button>

          <button class="btn--icon" @click="${this.print}" title="Print">
            ${unsafeSVG(printIcon)}
          </button>
          <button class="btn--icon btn--download" @click="${this.download}" title="Download">
            ${unsafeSVG(downloadIcon)}
          </button>

          <slot name="close-button">
            <button class="btn--icon" @click="${this.close}" title="Close">
              ${unsafeSVG(closeIcon)}
            </button>
          </slot>
        </div>

        <div class="search-dropdown ${this.searchOpen ? 'search-dropdown--open' : ''}">
          <input
            id="search-input"
            type="text"
            class="search-dropdown__input"
            placeholder="Search in document..."
            @input="${this.handleSearchInput}"
            @keydown="${this.handleSearchKeydown}"
            @click="${(e) => e.stopPropagation()}"
          />
          <span class="search-info">${matchDisplay}</span>
          <button class="btn--icon" @click="${this.previousSearchMatch}" ?disabled="${matchCount === 0}">
            ${unsafeSVG(arrowUpIcon)}
          </button>
          <button class="btn--icon" @click="${this.nextSearchMatch}" ?disabled="${matchCount === 0}">
            ${unsafeSVG(arrowDownIcon)}
          </button>
          <button class="btn--icon" @click="${this.closeSearch}">
            ${unsafeSVG(closeIcon)}
          </button>
        </div>
      </div>
    `
  }

  _focusSearchInput() {
    const searchInput = this.shadowRoot.getElementById('search-input')
    if (searchInput) setTimeout(() => searchInput.focus(), 100)
  }

  _clearSearch() {
    const searchInput = this.shadowRoot.getElementById('search-input')
    if (searchInput) {
      searchInput.value = ''
      this.context?.search('')
    }
  }
}

customElements.define('rm-pdf-toolbar', PDFToolbar)

