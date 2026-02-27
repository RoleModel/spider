import { html } from 'lit'
import { ContextProvider } from '@lit/context'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import jbig2WasmUrl from 'pdfjs-dist/wasm/jbig2.wasm?url'
import openjpegWasmUrl from 'pdfjs-dist/wasm/openjpeg.wasm?url'
import qcmsWasmUrl from 'pdfjs-dist/wasm/qcms_bg.wasm?url'
import styles from './pdf-viewer.styles.js'
import { pdfContext } from './pdf-context.js'
import { createThemeStyleSheet } from './theme-config.js'
import { normalizeText } from './helpers/text-helper.js'
import './toolbar/pdf-toolbar.js'
import './sidebar/pdf-sidebar.js'
import './canvas/pdf-canvas.js'
import RoleModelElement from '../../internal/rolemodel-element.js'

const BUNDLED_WASM_URLS = {
  'jbig2.wasm': jbig2WasmUrl,
  'openjpeg.wasm': openjpegWasmUrl,
  'qcms_bg.wasm': qcmsWasmUrl,
}

class LocalWasmFactory {
  constructor() {}
  async fetch({ filename }) {
    const url = BUNDLED_WASM_URLS[filename]
    if (!url) throw new Error(`Unknown WASM file: ${filename}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`)
    return new Uint8Array(await response.arrayBuffer())
  }
}

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default class PDFViewer extends RoleModelElement {
  static get properties() {
    return {
      src: { type: String },
      open: { type: Boolean, reflect: true },
      initialPage: { type: Number, attribute: 'initial-page' },
      themeHue: { type: Number, attribute: 'theme-hue' },
      themeSaturation: { type: Number, attribute: 'theme-saturation' },
      escapeClosesViewer: { type: Boolean, attribute: 'escape-closes-viewer' },
      pdfDoc: { type: Object, state: true },
      currentPage: { type: Number, state: true },
      totalPages: { type: Number, state: true },
      scale: { type: Number, state: true },
      sidebarCollapsed: { type: Boolean, state: true },
      shouldScroll: { type: Boolean, state: true },
      searchTerm: { type: String, state: true },
      searchMatches: { type: Array, state: true },
      currentMatchIndex: { type: Number, state: true },
      searchOpen: { type: Boolean, state: true },
      error: { type: Object, state: true },
      themeStyleSheet: { type: Object, state: true },
      fitToScreenScale: { type: Number, state: true }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this.src = ''
    this.open = false
    this.initialPage = 1
    this.themeHue = 217
    this.themeSaturation = 89
    this.escapeClosesViewer = false
    this.pdfDoc = null
    this.currentPage = 1
    this.totalPages = 0
    this.scale = 1.5
    this.sidebarCollapsed = window.innerWidth <= 512
    this.shouldScroll = false
    this.searchTerm = ''
    this.searchMatches = []
    this.currentMatchIndex = -1
    this.searchOpen = false
    this.error = null
    this.loading = false
    this.themeStyleSheet = createThemeStyleSheet(this.themeHue, this.themeSaturation)
    this.fitToScreenScale = null

    this._provider = new ContextProvider(this, {
      context: pdfContext,
      initialValue: this._createContextValue()
    })

    this._handleKeyDown = this._handleKeyDown.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('keydown', this._handleKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('keydown', this._handleKeyDown)
  }

  _handleKeyDown(event) {
    if (!this.open) return

    const target = event.composedPath()[0]
    const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

    if (isInputField && event.key !== 'Escape') return

    const shortcuts = {
      'Escape': () => {
        if (this.searchOpen) {
          this.searchOpen = false
          return true
        } else if (this.escapeClosesViewer) {
          this.open = false
          return true
        }
        return false
      },
      '/': () => {
        if (!this.searchOpen) {
          this.searchOpen = true
          return true
        }
        return false
      },
      's': () => {
        this.sidebarCollapsed = !this.sidebarCollapsed
        return true
      },
      'p': () => {
        this.printPDF()
        return true
      },
      'ArrowUp': () => {
        if (this.currentPage > 1) {
          this.shouldScroll = true
          this.currentPage--
          return true
        }
        return false
      },
      'ArrowDown': () => {
        if (this.currentPage < this.totalPages) {
          this.shouldScroll = true
          this.currentPage++
          return true
        }
        return false
      }
    }

    const handler = shortcuts[event.key]
    if (handler && handler()) {
      event.preventDefault()
    }
  }

  _createContextValue() {
    return {
      pdfDoc: this.pdfDoc,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      scale: this.scale,
      sidebarCollapsed: this.sidebarCollapsed,
      shouldScroll: this.shouldScroll,
      searchTerm: this.searchTerm,
      searchMatches: this.searchMatches,
      currentMatchIndex: this.currentMatchIndex,
      searchOpen: this.searchOpen,
      open: this.open,
      setCurrentPage: (page) => {
        this.currentPage = page
      },
      setScale: (scale) => {
        this.scale = scale
      },
      setShouldScroll: (shouldScroll) => {
        this.shouldScroll = shouldScroll
      },
      nextPage: () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++
        }
      },
      previousPage: () => {
        if (this.currentPage > 1) {
          this.currentPage--
        }
      },
      zoomIn: () => {
        this.scale += 0.25
      },
      zoomOut: () => {
        if (this.scale > 0.5) {
          this.scale -= 0.25
        }
      },
      fitToScreen: () => {
        this.fitPDFToScreen()
      },
      print: async () => {
        await this.printPDF()
      },
      download: () => {
        this.downloadPDF()
      },
      toggleSidebar: () => {
        this.sidebarCollapsed = !this.sidebarCollapsed
      },
      openSearch: () => {
        this.searchOpen = true
      },
      closeSearch: () => {
        this.searchOpen = false
      },
      search: async (term) => {
        await this.performSearch(term)
      },
      nextMatch: () => {
        this.goToNextMatch()
      },
      previousMatch: () => {
        this.goToPreviousMatch()
      },
      close: () => {
        this.open = false
      }
    }
  }

  async printPDF() {
    if (!this.pdfDoc) return

    try {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document

      const style = iframeDoc.createElement('style')
      style.textContent = `
        @page {
          margin: 0;
          size: auto;
        }
        body {
          margin: 0;
        }
        img {
          display: block;
          width: 100%;
        }
      `
      iframeDoc.head.appendChild(style)

      for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
        const page = await this.pdfDoc.getPage(pageNum)
        const viewport = page.getViewport({ scale: 1.5 })

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise

        const img = document.createElement('img')
        img.src = canvas.toDataURL()
        img.style.width = '100%'
        img.style.pageBreakAfter = pageNum < this.totalPages ? 'always' : 'auto'
        iframeDoc.body.appendChild(img)
      }

      iframe.contentWindow.focus()
      iframe.contentWindow.print()

      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
    } catch (error) {
      console.error('Error printing PDF:', error)
    }
  }

  async downloadPDF() {
    if (!this.src) return

    try {
      const response = await fetch(this.src)

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/pdf')) {
        throw new Error(`Unexpected content type: ${contentType}`)
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = this.src.split('/').pop() || 'document.pdf'
      link.click()

      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  fitPDFToScreen() {
    if (!this.fitToScreenScale) return

    this.scale = this.fitToScreenScale
    this.shouldScroll = true
  }

  willUpdate(changedProperties) {
    if (
      changedProperties.has('pdfDoc') ||
      changedProperties.has('currentPage') ||
      changedProperties.has('totalPages') ||
      changedProperties.has('scale') ||
      changedProperties.has('sidebarCollapsed') ||
      changedProperties.has('shouldScroll') ||
      changedProperties.has('searchTerm') ||
      changedProperties.has('searchMatches') ||
      changedProperties.has('currentMatchIndex') ||
      changedProperties.has('searchOpen') ||
      changedProperties.has('open')
    ) {
      this._provider.setValue(this._createContextValue())
    }

    if (changedProperties.has('themeHue') || changedProperties.has('themeSaturation')) {
      this._updateThemeColors()
    }
  }

  async updated(changedProperties) {
    if (changedProperties.has('src') && this.src && this.open) {
      await this.loadPDF()
    }

    if (changedProperties.has('open') && this.open && this.src && !this.pdfDoc) {
      await this.loadPDF()
    }
  }

  _updateThemeColors() {
    this.themeStyleSheet = createThemeStyleSheet(this.themeHue, this.themeSaturation)
    this.shadowRoot.adoptedStyleSheets = [
      ...this.constructor.elementStyles.map(s => s.styleSheet),
      this.themeStyleSheet
    ]
  }

  async firstUpdated() {
    this._updateThemeColors()
  }

  async loadPDF() {
    if (!this.src) return

    this.error = null
    this.pdfDoc = null
    this.loading = true
    try {
      const loadingTask = pdfjsLib.getDocument({ url: this.src, WasmFactory: LocalWasmFactory })
      this.pdfDoc = await loadingTask.promise
      this.totalPages = this.pdfDoc.numPages

      const pageToLoad = Math.min(Math.max(1, this.initialPage || 1), this.totalPages)
      this.currentPage = pageToLoad

      if (pageToLoad > 1) {
        this.shouldScroll = true
      }

      this.loading = false

      requestAnimationFrame(() => {
        this._calculateInitialScale(pageToLoad)
      })
    } catch (error) {
      console.error('Error loading PDF:', error)
      this.error = {
        message: error.message || 'Failed to load PDF',
        name: error.name || 'PDFError'
      }
      this.loading = false
    }
  }

  async _calculateInitialScale(pageNum) {
    try {
      const page = await this.pdfDoc.getPage(pageNum)

      await this.updateComplete

      const canvas = this.shadowRoot.querySelector('rm-pdf-canvas')
      if (!canvas) return

      await canvas.updateComplete

      const container = canvas.shadowRoot?.querySelector('.canvas-container')
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      const isMobile = window.innerWidth <= 512
      const basePadding = isMobile ? 0 : 32
      const gap = isMobile ? 0 : 16
      const maxPadding = 100

      const viewport = page.getViewport({ scale: 1 })

      const availableWidthWithBase = containerWidth - (basePadding * 2)
      const availableHeightWithBase = containerHeight - (basePadding * 2) - gap

      const scaleX = availableWidthWithBase / viewport.width
      const scaleY = availableHeightWithBase / viewport.height

      let newScale = Math.min(scaleX, scaleY)

      const finalWidth = viewport.width * newScale
      const horizontalPadding = (containerWidth - finalWidth) / 2
      if (horizontalPadding > maxPadding) {
        newScale = (containerWidth - (maxPadding * 2)) / viewport.width
      }

      const finalScale = Math.max(0.5, Math.min(newScale, 3))
      this.scale = finalScale
      this.fitToScreenScale = finalScale
    } catch (error) {
      console.error('Error calculating initial scale:', error)
    }
  }

  _handleRetry() {
    this.loadPDF()
  }

  async performSearch(term) {
    this.searchTerm = term
    this.searchMatches = []
    this.currentMatchIndex = -1

    if (!term || !this.pdfDoc) return

    const matches = []
    const normalizedTerm = normalizeText(term)
    const searchTermLower = normalizedTerm.toLowerCase()

    for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
      try {
        const page = await this.pdfDoc.getPage(pageNum)
        const textContent = await page.getTextContent()

        let pageText = ''
        const items = []

        textContent.items.forEach((item) => {
          const normalizedText = normalizeText(item.str)
          items.push({
            text: normalizedText,
            index: pageText.length
          })
          pageText += normalizedText
        })

        const pageTextLower = pageText.toLowerCase()
        let index = pageTextLower.indexOf(searchTermLower)

        while (index !== -1) {
          matches.push({
            pageNum,
            charIndex: index,
            text: term,
            length: normalizedTerm.length
          })
          index = pageTextLower.indexOf(searchTermLower, index + 1)
        }
      } catch (error) {
        console.error(`Error searching page ${pageNum}:`, error)
      }
    }

    this.searchMatches = matches
    if (matches.length > 0) {
      this.currentMatchIndex = 0
      this.shouldScroll = true
      this.currentPage = matches[0].pageNum
    }
  }

  goToNextMatch() {
    if (this.searchMatches.length === 0) return

    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.searchMatches.length
    const match = this.searchMatches[this.currentMatchIndex]
    this.shouldScroll = true
    this.currentPage = match.pageNum
  }

  goToPreviousMatch() {
    if (this.searchMatches.length === 0) return

    this.currentMatchIndex = this.currentMatchIndex <= 0
      ? this.searchMatches.length - 1
      : this.currentMatchIndex - 1
    const match = this.searchMatches[this.currentMatchIndex]
    this.shouldScroll = true
    this.currentPage = match.pageNum
  }

  _renderContent() {
    if (this.error) {
      return this._renderError()
    }

    if (this.loading) {
      return this._renderLoading()
    }

    return html`
      <div class="content-container">
        <rm-pdf-sidebar></rm-pdf-sidebar>
        <rm-pdf-canvas></rm-pdf-canvas>
      </div>
    `
  }

  _renderLoading() {
    return html`
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading PDF...</p>
      </div>
    `
  }

  _renderError() {
    return html`
      <div class="error-container">
        <div class="error-content">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"/>
            <path d="M12 8v4m0 4h.01" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h2 class="error-title">Unable to Load PDF</h2>
          <p class="error-message">${this.error.message}</p>
          <button class="error-retry" @click=${this._handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    `
  }

  render() {
    return html`
      <div class="pdf-viewer-container">
        <rm-pdf-toolbar>
          <slot name="close-button" slot="close-button"></slot>
        </rm-pdf-toolbar>
        ${this._renderContent()}
      </div>
    `
  }
}

customElements.define('rm-pdf-viewer', PDFViewer)
