import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import '../../src/components/pdf-viewer/page/pdf-page.js'
import { createMockPage } from '../helpers/test-utils.js'

function createPendingRenderTask() {
  let reject
  const task = {
    promise: new Promise((_, r) => { reject = r }),
    cancel: vi.fn(() => {
      const error = new Error('Rendering cancelled')
      error.name = 'RenderingCancelledException'
      reject(error)
    })
  }
  return task
}

const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

describe('PDFPage Component', () => {
  let element
  let renderTasks

  beforeEach(async () => {
    renderTasks = []
    const page = createMockPage(1)
    page.render = vi.fn(() => {
      const task = createPendingRenderTask()
      renderTasks.push(task)
      return task
    })

    element = document.createElement('rm-pdf-page')
    document.body.appendChild(element)
    await element.updateComplete

    element.page = page
    await flushPromises()
  })

  afterEach(() => {
    element.remove()
  })

  describe('Overlapping renders', () => {
    it('cancels every superseded render so only the latest one draws', async () => {
      element.renderPage()
      await flushPromises()
      element.renderPage()
      await flushPromises()

      expect(renderTasks).toHaveLength(3)
      expect(renderTasks[0].cancel).toHaveBeenCalled()
      expect(renderTasks[1].cancel).toHaveBeenCalled()
      expect(renderTasks[2].cancel).not.toHaveBeenCalled()
    })
  })
})
