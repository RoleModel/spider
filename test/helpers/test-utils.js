import { vi } from 'vitest'

export function createMockPDFDocument(numPages = 3) {
  const pages = []

  for (let i = 1; i <= numPages; i++) {
    pages.push(createMockPage(i))
  }

  return {
    numPages,
    getPage: vi.fn((pageNum) => {
      if (pageNum < 1 || pageNum > numPages) {
        return Promise.reject(new Error(`Page ${pageNum} not found`))
      }
      return Promise.resolve(pages[pageNum - 1])
    }),
    destroy: vi.fn().mockResolvedValue(undefined),
  }
}

export function createMockPage(pageNumber = 1) {
  const viewport = {
    width: 612,
    height: 792,
    scale: 1.5,
  }

  return {
    pageNumber,
    getViewport: vi.fn(({ scale = 1 }) => ({
      ...viewport,
      width: viewport.width * scale,
      height: viewport.height * scale,
      scale,
      transform: [scale, 0, 0, scale, 0, 0],
    })),
    render: vi.fn(() => ({
      promise: Promise.resolve(),
      cancel: vi.fn(),
    })),
    getTextContent: vi.fn(() =>
      Promise.resolve({
        items: [
          { str: 'Sample text on page ' + pageNumber, transform: [1, 0, 0, 1, 0, 0] },
          { str: 'More content here', transform: [1, 0, 0, 1, 0, 20] },
        ]
      })
    ),
    cleanup: vi.fn(),
  }
}

export function mockPDFJS() {
  return {
    getDocument: vi.fn((src) => {
      if (typeof src === 'string' && src.includes('error')) {
        return {
          promise: Promise.reject(new Error('Failed to load PDF')),
        }
      }

      return {
        promise: Promise.resolve(createMockPDFDocument()),
      }
    }),
    GlobalWorkerOptions: {
      workerSrc: '/mocked-worker.js',
    },
  }
}

export async function waitForElement(shadowRoot, selector, timeout = 3000) {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const element = shadowRoot.querySelector(selector)
    if (element) {
      return element
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  throw new Error(`Element ${selector} not found within ${timeout}ms`)
}

export async function waitForCondition(condition, timeout = 3000) {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  throw new Error(`Condition not met within ${timeout}ms`)
}
