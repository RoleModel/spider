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

describe('PDF Viewer Integration Tests', () => {
  let element

  beforeEach(() => {
    vi.clearAllMocks()
    pdfjsLib.getDocument.mockReturnValue({
      promise: Promise.resolve(createMockPDFDocument(10))
    })
  })

  describe('Complete User Workflow', () => {
    it('should handle complete PDF viewing workflow', async () => {
      element = await createViewer({
        src: '/test.pdf',
        'initial-page': '1',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      expect(element.pdfDoc).toBeDefined()
      expect(element.totalPages).toBe(10)
      expect(element.currentPage).toBe(1)

      const context = element._createContextValue()

      context.nextPage()
      await element.updateComplete
      expect(element.currentPage).toBe(2)

      context.zoomIn()
      await element.updateComplete
      expect(element.scale).toBe(1.75)

      context.zoomOut()
      await element.updateComplete
      expect(element.scale).toBe(1.5)

      context.toggleSidebar()
      await element.updateComplete
      expect(element.sidebarCollapsed).toBe(true)

      context.toggleSidebar()
      await element.updateComplete
      expect(element.sidebarCollapsed).toBe(false)

      context.setCurrentPage(5)
      await element.updateComplete
      expect(element.currentPage).toBe(5)

      context.close()
      await element.updateComplete
      expect(element.open).toBe(false)
    })

    it('should handle search workflow', async () => {
      element = await createViewer({
        src: '/test.pdf',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      const context = element._createContextValue()
      await context.search('Sample text')
      await element.updateComplete

      expect(element.searchTerm).toBe('Sample text')
      expect(element.searchMatches.length).toBeGreaterThan(0)

      if (element.searchMatches.length > 1) {
        const firstMatch = element.currentMatchIndex
        context.nextMatch()
        await element.updateComplete
        expect(element.currentMatchIndex).not.toBe(firstMatch)
      }
    })

    it('should handle error states gracefully', async () => {
      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.reject(new Error('Network error'))
      })

      element = await createViewer({
        src: '/broken.pdf',
        open: true
      })

      await waitForCondition(() => element.error !== null, 3000)

      expect(element.error).toBeDefined()
      expect(element.pdfDoc).toBeNull()
    })

    it('should handle rapid page changes', async () => {
      element = await createViewer({
        src: '/test.pdf',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      const context = element._createContextValue()

      context.setCurrentPage(3)
      context.setCurrentPage(5)
      context.setCurrentPage(7)

      await element.updateComplete

      expect(element.currentPage).toBe(7)
    })

    it('should maintain state during zoom changes', async () => {
      element = await createViewer({
        src: '/test.pdf',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      const context = element._createContextValue()

      context.setCurrentPage(5)
      await element.updateComplete

      const currentPage = element.currentPage

      context.zoomIn()
      await element.updateComplete

      expect(element.currentPage).toBe(currentPage)
      expect(element.scale).toBe(1.75)
    })

    it('should handle initial page property', async () => {
      element = await createViewer({
        src: '/test.pdf',
        'initial-page': '5',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      expect(element.initialPage).toBe(5)
    })

    it('should update when src changes', async () => {
      element = await createViewer({
        src: '/test1.pdf',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)
      expect(element.totalPages).toBe(10)

      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.resolve(createMockPDFDocument(5))
      })

      element.src = '/test2.pdf'
      await element.updateComplete

      await waitForCondition(() => element.totalPages === 5)

      expect(element.totalPages).toBe(5)
    })
  })

  describe('Context Sharing', () => {
    it('should provide consistent context to all components', async () => {
      element = await createViewer({
        src: '/test.pdf',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      const context1 = element._createContextValue()
      const context2 = element._createContextValue()

      expect(context1.currentPage).toBe(context2.currentPage)
      expect(context1.totalPages).toBe(context2.totalPages)
      expect(context1.scale).toBe(context2.scale)
      expect(context1.pdfDoc).toBe(context2.pdfDoc)
    })
  })

  describe('Boundary Conditions', () => {
    it('should handle single page PDF', async () => {
      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.resolve(createMockPDFDocument(1))
      })

      element = await createViewer({
        src: '/single-page.pdf',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      expect(element.totalPages).toBe(1)
      expect(element.currentPage).toBe(1)

      const context = element._createContextValue()

      context.nextPage()
      await element.updateComplete
      expect(element.currentPage).toBe(1)

      context.previousPage()
      await element.updateComplete
      expect(element.currentPage).toBe(1)
    })

    it('should handle large PDF', async () => {
      pdfjsLib.getDocument.mockReturnValue({
        promise: Promise.resolve(createMockPDFDocument(100))
      })

      element = await createViewer({
        src: '/large.pdf',
        open: true
      })

      await waitForCondition(() => element.pdfDoc !== null)

      expect(element.totalPages).toBe(100)

      const context = element._createContextValue()

      context.setCurrentPage(50)
      await element.updateComplete
      expect(element.currentPage).toBe(50)

      context.setCurrentPage(100)
      await element.updateComplete
      expect(element.currentPage).toBe(100)
    })
  })
})
