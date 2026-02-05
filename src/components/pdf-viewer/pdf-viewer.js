import { LitElement, html } from 'lit'
import { ContextProvider } from '@lit/context'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import styles from './pdf-viewer.styles.js'
import { pdfContext } from './pdf-context.js'
import { updateThemeColors } from './theme-config.js'
import { normalizeText } from './helpers/text-helper.js'
import './toolbar/pdf-toolbar.js'
import './sidebar/pdf-sidebar.js'
import './canvas/pdf-canvas.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default class PDFViewer extends LitElement {
  static get properties() {
    return {
      src: { type: String },
      open: { type: Boolean, reflect: true },
      initialPage: { type: Number, attribute: 'initial-page' },
      closeUrl: { type: String, attribute: 'close-url' },
      themeHue: { type: Number, attribute: 'theme-hue' },
      themeSaturation: { type: Number, attribute: 'theme-saturation' },
      pdfDoc: { type: Object, state: true },
      currentPage: { type: Number, state: true },
      totalPages: { type: Number, state: true },
      scale: { type: Number, state: true },
      sidebarCollapsed: { type: Boolean, state: true },
      shouldScroll: { type: Boolean, state: true },
      searchTerm: { type: String, state: true },
      searchMatches: { type: Array, state: true },
      currentMatchIndex: { type: Number, state: true }
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
    this.closeUrl = ''
    this.themeHue = 217
    this.themeSaturation = 89
    this.pdfDoc = null
    this.currentPage = 1
    this.totalPages = 0
    this.scale = 1.5
    this.sidebarCollapsed = false
    this.shouldScroll = false
    this.searchTerm = ''
    this.searchMatches = []
    this.currentMatchIndex = -1

    this._provider = new ContextProvider(this, {
      context: pdfContext,
      initialValue: this._createContextValue()
    })
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
      print: async () => {
        await this.printPDF()
      },
      download: () => {
        this.downloadPDF()
      },
      toggleSidebar: () => {
        this.sidebarCollapsed = !this.sidebarCollapsed
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
        if (this.closeUrl) {
          window.location.href = this.closeUrl
        } else {
          this.open = false
        }
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

  downloadPDF() {
    if (!this.src) return

    try {
      const link = document.createElement('a')
      link.href = this.src
      link.download = this.src.split('/').pop() || 'document.pdf'
      link.click()
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  async updated(changedProperties) {
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
      changedProperties.has('open')
    ) {
      this._provider.setValue(this._createContextValue())
    }

    if (changedProperties.has('themeHue') || changedProperties.has('themeSaturation')) {
      this._updateThemeColors()
    }

    if (changedProperties.has('src') && this.src && this.open) {
      await this.loadPDF()
    }

    if (changedProperties.has('open') && this.open && this.src && !this.pdfDoc) {
      console.log('loading')
      await this.loadPDF()
    }
  }

  _updateThemeColors() {
    updateThemeColors(this, this.themeHue, this.themeSaturation)
  }

  async firstUpdated() {
    this._updateThemeColors()
  }

  async loadPDF() {
    if (!this.src) return

    try {
      const loadingTask = pdfjsLib.getDocument(this.src)
      this.pdfDoc = await loadingTask.promise
      this.totalPages = this.pdfDoc.numPages

      const pageToLoad = Math.min(Math.max(1, this.initialPage || 1), this.totalPages)
      this.currentPage = pageToLoad

      if (pageToLoad > 1) {
        this.shouldScroll = true
      }
    } catch (error) {
      console.error('Error loading PDF:', error)
    }
  }

  async performSearch(term) {
    this.searchTerm = term
    this.searchMatches = []
    this.currentMatchIndex = -1

    if (!term || !this.pdfDoc) return

    const matches = []

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

        let index = pageText.indexOf(term)

        while (index !== -1) {
          matches.push({
            pageNum,
            charIndex: index,
            text: term
          })
          index = pageText.indexOf(term, index + 1)
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

  render() {
    return html`
      <div class="pdf-viewer-container">
        <rm-pdf-toolbar>
          <slot name="close-button" slot="close-button"></slot>
        </rm-pdf-toolbar>
        <div class="content-container">
          <rm-pdf-sidebar></rm-pdf-sidebar>
          <rm-pdf-canvas></rm-pdf-canvas>
        </div>
      </div>
    `
  }
}

customElements.define('rm-pdf-viewer', PDFViewer)

