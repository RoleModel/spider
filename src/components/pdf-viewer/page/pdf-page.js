import { html, render } from 'lit'
import * as pdfjsLib from 'pdfjs-dist'
import { PDFViewerComponent } from '../pdf-viewer-component.js'
import { normalizeText } from '../helpers/text-helper.js'
import styles from './pdf-page.styles.js'

export default class PDFPage extends PDFViewerComponent {
  static get styles() {
    return styles
  }

  static get properties() {
    return {
      page: { type: Object },
      scale: { type: Number },
      pageNumber: { type: Number },
      searchTerm: { type: String },
      searchMatches: { type: Array },
      currentMatchIndex: { type: Number }
    }
  }

  constructor() {
    super()
    this.page = null
    this.scale = 1
    this.pageNumber = 1
    this._renderTask = null
  }

  async updated(changedProperties) {
    if (this.page && (changedProperties.has('page') || changedProperties.has('scale'))) {
      await this.renderPage()
    } else if (this.page && (changedProperties.has('searchTerm') || changedProperties.has('searchMatches') || changedProperties.has('currentMatchIndex'))) {
      const textLayerDiv = this.shadowRoot.querySelector('.text-layer')
      if (textLayerDiv) {
        const viewport = this.page.getViewport({ scale: this.scale })
        textLayerDiv.innerHTML = ''
        await this.renderTextLayer(viewport, textLayerDiv)
      }
    }
  }

  async renderPage() {
    if (!this.page) return

    this._cancelRenderTask()

    const viewport = this.page.getViewport({ scale: this.scale })
    const devicePixelRatio = window.devicePixelRatio || 1

    const pageWrapper = this.shadowRoot.querySelector('.page-wrapper')
    if (!pageWrapper) return

    pageWrapper.style.width = `${viewport.width}px`
    pageWrapper.style.height = `${viewport.height}px`

    const canvas = this.shadowRoot.querySelector('canvas')
    const canvasContext = canvas.getContext('2d')

    canvas.height = viewport.height * devicePixelRatio
    canvas.width = viewport.width * devicePixelRatio
    canvas.style.width = `${viewport.width}px`
    canvas.style.height = `${viewport.height}px`

    const scaledViewport = this.page.getViewport({ scale: this.scale * devicePixelRatio })

    try {
      this._renderTask = this.page.render({
        canvasContext,
        viewport: scaledViewport
      })

      await this._renderTask.promise
      this._renderTask = null

      const textLayerDiv = this.shadowRoot.querySelector('.text-layer')
      textLayerDiv.style.width = `${viewport.width}px`
      textLayerDiv.style.height = `${viewport.height}px`
      textLayerDiv.innerHTML = ''

      await this.renderTextLayer(viewport, textLayerDiv)

      const annotationLayerDiv = this.shadowRoot.querySelector('.annotation-layer')
      annotationLayerDiv.style.width = `${viewport.width}px`
      annotationLayerDiv.style.height = `${viewport.height}px`
      annotationLayerDiv.innerHTML = ''

      await this.renderLinkAnnotationLayer(viewport, annotationLayerDiv)
    } catch (error) {
      if (error.name !== 'RenderingCancelledException') {
        console.error('Error rendering page:', error)
      }
      this._renderTask = null
    }
  }

  async renderTextLayer(viewport, textLayerDiv) {
    try {
      const textContent = await this.page.getTextContent()

      const pageMatches = this.searchMatches?.filter(match => match.pageNum === this.pageNumber) || []
      let charPosition = 0

      textContent.items.forEach((textItem) => {
        if (!viewport.transform || !textItem.transform) {
          return
        }

        const tx = pdfjsLib.Util.transform(
          viewport.transform,
          textItem.transform
        )

        const fontSize = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]))
        const fontAscent = fontSize * 0.8

        const textDiv = document.createElement('div')
        textDiv.style.position = 'absolute'
        textDiv.style.left = `${tx[4]}px`
        textDiv.style.top = `${tx[5] - fontAscent}px`
        textDiv.style.fontSize = `${fontSize}px`
        textDiv.style.fontFamily = textItem.fontName || 'sans-serif'

        if (textItem.str.length > 0) {
          const width = textItem.width * viewport.scale
          textDiv.style.width = `${width}px`
        }

        const normalizedText = normalizeText(textItem.str)
        const itemStart = charPosition
        const itemEnd = charPosition + normalizedText.length

        const overlappingMatches = pageMatches.filter(match => {
          const matchEnd = match.charIndex + (match.length || this.searchTerm.length)
          return match.charIndex < itemEnd && matchEnd > itemStart
        })

        if (overlappingMatches.length > 0) {
          this.highlightText(textDiv, normalizedText, itemStart, overlappingMatches)
        } else {
          textDiv.textContent = normalizedText
        }

        charPosition += normalizedText.length
        textLayerDiv.appendChild(textDiv)
      })
    } catch (error) {
      console.error('Error rendering text layer:', error)
    }
  }

  async renderLinkAnnotationLayer(viewport, annotationLayerDiv) {
    try {
      const annotations = await this.page.getAnnotations({ intent: 'display' })
      const linkAnnotations = annotations.filter(annotation =>
        annotation?.subtype === 'Link' &&
        Array.isArray(annotation.rect) &&
        (annotation.url || annotation.unsafeUrl)
      )

      const links = linkAnnotations.map(annotation => {
        const linkUrl = annotation.url || annotation.unsafeUrl
        const viewportRect = this._getViewportRect(annotation.rect, viewport)
        if (!viewportRect) return html``

        const [left, top, width, height] = viewportRect
        return html`
          <a
            class="annotation-link"
            href=${linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open link: ${linkUrl}"
            style="left:${left}px;top:${top}px;width:${width}px;height:${height}px"
          ></a>
        `
      })
      render(html`${links}`, annotationLayerDiv)
    } catch (error) {
      console.error('Error rendering annotation layer:', error)
    }
  }

  _getViewportRect(annotationRect, viewport) {
    let coords
    if (typeof viewport.convertToViewportRectangle === 'function') {
      coords = viewport.convertToViewportRectangle(annotationRect)
    } else {
      const [x1, y1, x2, y2] = annotationRect
      const scale = viewport.scale || 1
      coords = [
        Math.min(x1, x2) * scale,
        viewport.height - (Math.max(y1, y2) * scale),
        Math.max(x1, x2) * scale,
        viewport.height - (Math.min(y1, y2) * scale)
      ]
    }

    const [x1, y1, x2, y2] = coords
    return [Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1)]
  }

  highlightText(element, text, itemStart, matches) {
    element.innerHTML = ''

    const segments = []
    let currentPos = 0

    matches.forEach(match => {
      const relativeStart = Math.max(0, match.charIndex - itemStart)
      const matchLength = match.length || this.searchTerm.length
      const relativeEnd = Math.min(text.length, match.charIndex + matchLength - itemStart)

      if (relativeStart > currentPos) {
        segments.push({ text: text.substring(currentPos, relativeStart), highlight: false })
      }

      const globalMatchIndex = this.searchMatches.indexOf(match)
      const isCurrentMatch = globalMatchIndex === this.currentMatchIndex

      segments.push({
        text: text.substring(relativeStart, relativeEnd),
        highlight: true,
        isCurrentMatch
      })

      currentPos = relativeEnd
    })

    if (currentPos < text.length) {
      segments.push({ text: text.substring(currentPos), highlight: false })
    }

    segments.forEach(segment => {
      if (segment.highlight) {
        const mark = document.createElement('mark')
        mark.textContent = segment.text
        mark.style.backgroundColor = segment.isCurrentMatch ? 'orange' : 'yellow'
        mark.style.color = 'transparent'
        element.appendChild(mark)
      } else {
        element.appendChild(document.createTextNode(segment.text))
      }
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._cancelRenderTask()
  }

  render() {
    return html`
      <div class="page-wrapper">
        <canvas data-page-number="${this.pageNumber}"></canvas>
        <div class="text-layer"></div>
        <div class="annotation-layer"></div>
      </div>
    `
  }

  _cancelRenderTask() {
    if (this._renderTask) {
      this._renderTask.cancel()
      this._renderTask = null
    }
  }
}

customElements.define('rm-pdf-page', PDFPage)
