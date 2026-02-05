import { html } from 'lit'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import styles from './pdf-toolbar.styles.js'
import closeIcon from '../../../assets/icons/close.svg'
import arrowLeftIcon from '../../../assets/icons/arrow-left.svg'
import arrowRightIcon from '../../../assets/icons/arrow-right.svg'
import zoomOutIcon from '../../../assets/icons/zoom-out.svg'
import zoomInIcon from '../../../assets/icons/zoom-in.svg'
import searchIcon from '../../../assets/icons/search.svg'
import printIcon from '../../../assets/icons/print.svg'
import downloadIcon from '../../../assets/icons/download.svg'
import closeSidebarIcon from '../../../assets/icons/close-sidebar.svg'
import openSidebarIcon from '../../../assets/icons/open-sidebar.svg'

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
              <img src=${openSidebarIcon} alt="Open Sidebar" />
            </button>
          ` : html`
            <button class="btn--icon" @click="${this.toggleSidebar}" title="Close Sidebar">
              <img src=${closeSidebarIcon} alt="Close Sidebar" />
            </button>
          `}

          <div class="toolbar__section-group">
            <button class="btn--icon" @click="${this.previousPage}" ?disabled="${currentPage <= 1}">
              <img src=${arrowLeftIcon} alt="Previous" title="Previous" />
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
              <img src=${arrowRightIcon} alt="Next" title="Next" />
            </button>
          </div>
        </div>

        <div class="toolbar__section">
          <div class="toolbar__section-group">
            <button class="btn--icon" @click="${this.zoomOut}" ?disabled="${scale <= 0.5}">
              <img src=${zoomOutIcon} alt="Zoom Out" title="Zoom Out" />
            </button>
            <span class="zoom-level">${Math.round(scale * 100)}%</span>
            <button class="btn--icon" @click="${this.zoomIn}">
              <img src=${zoomInIcon} alt="Zoom In" title="Zoom In" />
            </button>
          </div>
        </div>

        <div class="toolbar__section">
          <button class="btn--icon" @click="${this.toggleSearch}">
            <img src=${searchIcon} alt="Search" title="Search" />
          </button>

          <button class="btn--icon" @click="${this.print}" title="Print">
            <img src=${printIcon} alt="Print" />
          </button>
          <button class="btn--icon btn--download" @click="${this.download}" title="Download">
            <img src=${downloadIcon} alt="Download" />
          </button>

          <slot name="close-button">
            <button class="btn--icon" @click="${this.close}">
              <img src=${closeIcon} alt="Close" title="Close" />
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
            <img src=${arrowLeftIcon} alt="Previous Match" title="Previous Match" />
          </button>
          <button class="btn--icon" @click="${this.nextSearchMatch}" ?disabled="${matchCount === 0}">
            <img src=${arrowRightIcon} alt="Next Match" title="Next Match" />
          </button>
          <button class="btn--icon" @click="${this.closeSearch}">
            <img src=${closeIcon} alt="Close" title="Close" />
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

