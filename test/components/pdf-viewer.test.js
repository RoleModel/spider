import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as pdfjsLib from 'pdfjs-dist'
import '../../src/components/pdf-viewer/pdf-viewer.js'
import { createMockPDFDocument, waitForCondition } from '../helpers/test-utils.js'

vi.mock('pdfjs-dist', async () => {
  const actual = await vi.importActual('pdfjs-dist')
  return {
    ...actual,
    getDocument: vi.fn(),
    GlobalWorkerOptions: {
      workerSrc: '/mocked-worker.js',
    },
  }
})

async function createViewer(attributes = {}) {
  const element = document.createElement('rm-pdf-viewer')

  for (const [key, value] of Object.entries(attributes)) {
    if (typeof value === 'boolean') {
      if (value) element.setAttribute(key, '')
    } else {
      element.setAttribute(key, value)
    }
  }

  document.body.appendChild(element)
  await element.updateComplete

  return element
}

describe('PDFViewer Component', () => {
  let element

  beforeEach(() => {
    vi.clearAllMocks()
    pdfjsLib.getDocument.mockReturnValue({
      promise: Promise.resolve(createMockPDFDocument(5))
    })
  })

  describe('Initialization', () => {
    it('should create component with default properties', async () => {
      element = await createViewer()

      expect(element).toBeDefined()
      expect(element.src).toBe('')
      expect(element.open).toBe(false)
      expect(element.currentPage).toBe(1)
      expect(element.scale).toBe(1.5)
      expect(element.sidebarCollapsed).toBe(false)
    })

    it('should accept and set custom properties', async () => {
      element = await createViewer({
        src: '/test.pdf',
        'initial-page': '3',
        open: true
      })

      expect(element.src).toBe('/test.pdf')
      expect(element.initialPage).toBe(3)
      expect(element.open).toBe(true)
    })
  })

  describe('PDF Loading', () => {
    it('should load PDF document when src is set', async () => {
      element = await createViewer({ src: '/test.pdf', open: true })

      await waitForCondition(() => element.pdfDoc !== null)

      expect(pdfjsLib.getDocument).toHaveBeenCalledWith(expect.objectContaining({ url: '/test.pdf' }))
      expect(element.pdfDoc).toBeDefined()
      expect(element.totalPages).toBe(5)
    })
  })

  describe('Navigation', () => {
    beforeEach(async () => {
      element = await createViewer({ src: '/test.pdf', open: true })
      await waitForCondition(() => element.pdfDoc !== null)
    })

    it('should navigate to next page', async () => {
      expect(element.currentPage).toBe(1)

      const context = element._createContextValue()
      context.nextPage()

      await element.updateComplete
      expect(element.currentPage).toBe(2)
    })

    it('should not go beyond last page', async () => {
      element.currentPage = 5
      await element.updateComplete

      const context = element._createContextValue()
      context.nextPage()

      await element.updateComplete
      expect(element.currentPage).toBe(5)
    })
  })

  describe('Zoom Controls', () => {
    beforeEach(async () => {
      element = await createViewer({ src: '/test.pdf', open: true })
      await waitForCondition(() => element.pdfDoc !== null)
    })

    it('should zoom in', async () => {
      const initialScale = element.scale

      const context = element._createContextValue()
      context.zoomIn()

      await element.updateComplete
      expect(element.scale).toBe(initialScale + 0.25)
    })

    it('should zoom out', async () => {
      element.scale = 2.0
      await element.updateComplete

      const context = element._createContextValue()
      context.zoomOut()

      await element.updateComplete
      expect(element.scale).toBe(1.75)
    })

    it('should not zoom out below minimum scale', async () => {
      element.scale = 0.5
      await element.updateComplete

      const context = element._createContextValue()
      context.zoomOut()

      await element.updateComplete
      expect(element.scale).toBe(0.5)
    })
  })

  describe('Toolbar', () => {
    beforeEach(async () => {
      element = await createViewer({ src: '/test.pdf', open: true })
      await waitForCondition(() => element.pdfDoc !== null)
    })

    it('should render all toolbar buttons', async () => {
      const toolbar = element.shadowRoot.querySelector('rm-pdf-toolbar')
      expect(toolbar).toBeDefined()

      const toolbarShadow = toolbar.shadowRoot
      expect(toolbarShadow).toBeDefined()

      const buttons = toolbarShadow.querySelectorAll('button.btn--icon')
      expect(buttons.length).toBeGreaterThan(0)

      const buttonTexts = Array.from(buttons).map(btn => btn.getAttribute('title') || btn.className)

      expect(toolbarShadow.querySelector('button[title="Close Sidebar"]')).toBeDefined()
      expect(toolbarShadow.querySelector('button[title="Print"]')).toBeDefined()
      expect(toolbarShadow.querySelector('button[title="Download"]')).toBeDefined()
      expect(toolbarShadow.querySelector('button[title="Close"]')).toBeDefined()

      const zoomButtons = Array.from(buttons).filter(btn => {
        const svg = btn.querySelector('svg')
        return svg !== null
      })
      expect(zoomButtons.length).toBeGreaterThan(6)
    })
  })

  describe('Sidebar', () => {
    beforeEach(async () => {
      element = await createViewer({ src: '/test.pdf', open: true })
      await waitForCondition(() => element.pdfDoc !== null)
    })

    it('should render thumbnails for all pages', async () => {
      const sidebar = element.shadowRoot.querySelector('rm-pdf-sidebar')
      expect(sidebar).toBeDefined()

      const sidebarShadow = sidebar.shadowRoot
      expect(sidebarShadow).toBeDefined()

      await waitForCondition(() => {
        const thumbnails = sidebarShadow.querySelectorAll('rm-pdf-thumbnail')
        return thumbnails.length > 0
      })

      const thumbnails = sidebarShadow.querySelectorAll('rm-pdf-thumbnail')
      expect(thumbnails.length).toBe(5)

      thumbnails.forEach((thumbnail, index) => {
        expect(thumbnail.pageNumber).toBe(index + 1)
      })
    })

    it('should hide sidebar when collapsed', async () => {
      const sidebar = element.shadowRoot.querySelector('rm-pdf-sidebar')
      const sidebarShadow = sidebar.shadowRoot

      element.sidebarCollapsed = false
      await element.updateComplete
      await sidebar.updateComplete

      let sidebarDiv = sidebarShadow.querySelector('.sidebar')
      expect(sidebarDiv.classList.contains('collapsed')).toBe(false)

      element.sidebarCollapsed = true
      await element.updateComplete
      await sidebar.updateComplete

      sidebarDiv = sidebarShadow.querySelector('.sidebar')
      expect(sidebarDiv.classList.contains('collapsed')).toBe(true)
    })
  })
})
