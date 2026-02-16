import { beforeEach, describe, expect, it } from 'vitest'
import { createTabsFixture, waitForUpdates } from '../helpers/tabs-test-utils.js'

describe('Tabs Integration Tests', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders tab system with expected initial active states', async () => {
    const { root, firstTrigger, secondTrigger, firstPanel, secondPanel } = await createTabsFixture({ active: 'first' })

    expect(root.querySelectorAll('rm-tabs-trigger')).toHaveLength(2)
    expect(root.querySelectorAll('rm-tabs-panel')).toHaveLength(2)
    expect(firstTrigger.isActive).toBe(true)
    expect(secondTrigger.isActive).toBe(false)
    expect(firstPanel.active).toBe(true)
    expect(secondPanel.active).toBe(false)
  })

  it('updates trigger classes and panel visibility when trigger selects another tab', async () => {
    const { root, firstTrigger, secondTrigger, firstButton, secondButton, firstPanel, secondPanel } = await createTabsFixture({ active: 'first' })

    secondTrigger.setActive()
    await waitForUpdates(root, firstTrigger, secondTrigger, firstPanel, secondPanel)

    const firstPanelContainer = firstPanel.shadowRoot.querySelector('[role="tabpanel"]')
    const secondPanelContainer = secondPanel.shadowRoot.querySelector('[role="tabpanel"]')

    expect(root.active).toBe('second')
    expect(firstButton.classList.contains('tabs__btn--active')).toBe(false)
    expect(secondButton.classList.contains('tabs__btn--active')).toBe(true)
    expect(firstPanelContainer.hidden).toBe(true)
    expect(secondPanelContainer.hidden).toBe(false)
  })

  it('keeps accessibility attributes in sync across triggers and panels', async () => {
    const { root, firstTrigger, secondTrigger, firstPanel, secondPanel } = await createTabsFixture({ active: 'first' })

    const firstTriggerSlot = firstTrigger.shadowRoot.querySelector('slot')
    const secondTriggerSlot = secondTrigger.shadowRoot.querySelector('slot')
    const firstPanelContainer = firstPanel.shadowRoot.querySelector('[role="tabpanel"]')
    const secondPanelContainer = secondPanel.shadowRoot.querySelector('[role="tabpanel"]')

    expect(firstTriggerSlot.getAttribute('aria-selected')).toBe('true')
    expect(secondTriggerSlot.getAttribute('aria-selected')).toBe('false')
    expect(firstPanelContainer.getAttribute('aria-hidden')).toBe('false')
    expect(secondPanelContainer.getAttribute('aria-hidden')).toBe('true')

    secondPanel.activate()
    await waitForUpdates(root, firstTrigger, secondTrigger, firstPanel, secondPanel)

    expect(firstTriggerSlot.getAttribute('aria-selected')).toBe('false')
    expect(secondTriggerSlot.getAttribute('aria-selected')).toBe('true')
    expect(firstPanelContainer.getAttribute('aria-hidden')).toBe('true')
    expect(secondPanelContainer.getAttribute('aria-hidden')).toBe('false')
  })
})
