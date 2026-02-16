import { beforeEach, describe, expect, it } from 'vitest'
import '../../src/components/tabs/index.js'

async function createRootFixture({ active = 'first', tabName = 'first' } = {}) {
  const root = document.createElement('rm-tabs-root')
  root.active = active
  root.innerHTML = `
    <rm-tabs-trigger name="${tabName}" activeClass="tabs__btn--active">
      <button class="tabs__btn" type="button">${tabName}</button>
    </rm-tabs-trigger>
    <rm-tabs-panel name="${tabName}">
      <div class="tabs__panel">
        <span>${tabName} panel content</span>
      </div>
    </rm-tabs-panel>
  `

  document.body.appendChild(root)

  await root.updateComplete

  const trigger = root.querySelector('rm-tabs-trigger')
  const panel = root.querySelector('rm-tabs-panel')

  await Promise.all([trigger.updateComplete, panel.updateComplete])

  return { root, trigger, panel }
}

async function waitForUpdates(...elements) {
  await Promise.all(elements.map(element => element.updateComplete))
}

describe('RmTabsRoot', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders slotted tab triggers and panels', async () => {
    const { root } = await createRootFixture({ active: 'first', tabName: 'first' })

    expect(root.querySelectorAll('rm-tabs-trigger')).toHaveLength(1)
    expect(root.querySelectorAll('rm-tabs-panel')).toHaveLength(1)
  })

  it('updates active when rm-tab-select bubbles from descendants', async () => {
    const { root, trigger } = await createRootFixture({ active: 'first', tabName: 'first' })

    trigger.dispatchEvent(
      new CustomEvent('rm-tab-select', {
        bubbles: true,
        composed: true,
        detail: { name: 'second' }
      })
    )

    await waitForUpdates(root, trigger)

    expect(root.active).toBe('second')
  })

  it('updates child active state when active changes', async () => {
    const { root, trigger, panel } = await createRootFixture({ active: 'first', tabName: 'first' })

    expect(trigger.isActive).toBe(true)
    expect(panel.active).toBe(true)

    root.active = 'second'
    await waitForUpdates(root, trigger, panel)

    expect(trigger.isActive).toBe(false)
    expect(panel.active).toBe(false)
  })
})
