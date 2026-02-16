import { beforeEach, describe, expect, it, vi } from 'vitest'
import '../../src/components/tabs/index.js'

async function createPanelFixture({ active = 'first', panelName = 'first' } = {}) {
  const root = document.createElement('rm-tabs-root')
  root.active = active
  root.innerHTML = `
    <rm-tabs-panel name="${panelName}">
      <div class="tabs__panel">
        <span>${panelName} panel content</span>
      </div>
    </rm-tabs-panel>
  `

  document.body.appendChild(root)

  await root.updateComplete

  const panel = root.querySelector('rm-tabs-panel')

  await panel.updateComplete

  return { root, panel }
}

async function waitForUpdates(...elements) {
  await Promise.all(elements.map(element => element.updateComplete))
}

describe('RmTabsPanel', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('active reflects rm-tabs-root active tab', async () => {
    const { root, panel } = await createPanelFixture({ active: 'first', panelName: 'first' })

    expect(panel.active).toBe(true)

    root.active = 'second'
    await waitForUpdates(root, panel)

    expect(panel.active).toBe(false)
  })

  it('activate dispatches rm-tab-select and updates active panel', async () => {
    const { root, panel } = await createPanelFixture({ active: 'second', panelName: 'first' })
    const listener = vi.fn()

    panel.addEventListener('rm-tab-select', listener)
    panel.activate()

    await waitForUpdates(root, panel)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toEqual({ name: 'first' })
    expect(root.active).toBe('first')
    expect(panel.active).toBe(true)
  })

  it('updates hidden and aria-hidden on tabpanel based on active state', async () => {
    const { root, panel } = await createPanelFixture({ active: 'first', panelName: 'first' })

    const panelContainer = panel.shadowRoot.querySelector('[role="tabpanel"]')

    expect(panelContainer.hidden).toBe(false)
    expect(panelContainer.getAttribute('aria-hidden')).toBe('false')

    root.active = 'second'
    await waitForUpdates(root, panel)

    expect(panelContainer.hidden).toBe(true)
    expect(panelContainer.getAttribute('aria-hidden')).toBe('true')
  })
})
