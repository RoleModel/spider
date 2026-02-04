import { LitElement, html } from 'lit'
import { ContextProvider } from '@lit/context'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url'
import styles from './rm-pdf-viewer.styles.js'
import { pdfContext } from './pdf-context.js'
import './toolbar/rm-pdf-toolbar.js'
import './sidebar/rm-pdf-sidebar.js'
import './canvas/rm-pdf-canvas.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export default class PDFViewer extends LitElement {
  static get properties() {
    return {
      src: { type: String },
      themeHue: { type: Number, attribute: 'theme-hue' },
      themeSaturation: { type: Number, attribute: 'theme-saturation' },
      pdfDoc: { type: Object, state: true },
      currentPage: { type: Number, state: true },
      totalPages: { type: Number, state: true },
      scale: { type: Number, state: true },
      sidebarCollapsed: { type: Boolean, state: true },
      shouldScroll: { type: Boolean, state: true }
    }
  }

  static get styles() {
    return styles
  }

  constructor() {
    super()
    this.src = ''
    this.themeHue = 217
    this.themeSaturation = 89
    this.pdfDoc = null
    this.currentPage = 1
    this.totalPages = 0
    this.scale = 1.5
    this.sidebarCollapsed = false
    this.shouldScroll = false

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
          this.shouldScroll = true
          this.currentPage++
        }
      },
      previousPage: () => {
        if (this.currentPage > 1) {
          this.shouldScroll = true
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
      changedProperties.has('sidebarCollapsed')
    ) {
      this._provider.setValue(this._createContextValue())
    }

    if (changedProperties.has('themeHue') || changedProperties.has('themeSaturation')) {
      this._updateThemeColors()
    }

    if (changedProperties.has('src') && this.src) {
      await this.loadPDF()
    }
  }

  _updateThemeColors() {
    const h = this.themeHue
    const s = this.themeSaturation

    this.style.setProperty('--theme-primary', `hsl(${h}, ${s}%, 50%)`)
    this.style.setProperty('--theme-primary-light', `hsl(${h}, ${s}%, 90%)`)
    this.style.setProperty('--theme-primary-lighter', `hsl(${h}, ${s}%, 95%)`)
    this.style.setProperty('--theme-primary-dark', `hsl(${h}, ${s}%, 40%)`)
    this.style.setProperty('--theme-primary-darker', `hsl(${h}, ${s}%, 30%)`)
    this.style.setProperty('--theme-primary-transparent', `hsla(${h}, ${s}%, 50%, 70%)`)

    this.style.setProperty('--theme-neutral-50', 'hsl(0, 0%, 98%)')
    this.style.setProperty('--theme-neutral-100', 'hsl(0, 0%, 95%)')
    this.style.setProperty('--theme-neutral-200', 'hsl(0, 0%, 87%)')
    this.style.setProperty('--theme-neutral-300', 'hsl(0, 0%, 80%)')
    this.style.setProperty('--theme-neutral-400', 'hsl(0, 0%, 63%)')
    this.style.setProperty('--theme-neutral-500', 'hsl(0, 0%, 37%)')
    this.style.setProperty('--theme-neutral-600', 'hsl(0, 0%, 20%)')

    this.style.setProperty('--theme-border', 'hsl(0, 0%, 87%)')
    this.style.setProperty('--theme-shadow', 'rgba(0, 0, 0, 0.1)')
  }

  async firstUpdated() {
    this._updateThemeColors()
    if (this.src) {
      await this.loadPDF()
    }
  }

  async loadPDF() {
    if (!this.src) return

    try {
      const loadingTask = pdfjsLib.getDocument(this.src)
      this.pdfDoc = await loadingTask.promise
      this.totalPages = this.pdfDoc.numPages
      this.currentPage = 1
    } catch (error) {
      console.error('Error loading PDF:', error)
    }
  }

  render() {
    return html`
      <div class="pdf-viewer-container">
        <rm-pdf-toolbar></rm-pdf-toolbar>
        <div class="content-container">
          <rm-pdf-sidebar></rm-pdf-sidebar>
          <rm-pdf-canvas></rm-pdf-canvas>
        </div>
      </div>
    `
  }
}

customElements.define('rm-pdf-viewer', PDFViewer)

