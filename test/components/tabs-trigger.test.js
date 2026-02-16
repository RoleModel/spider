import { beforeEach, describe, expect, it, vi } from 'vitest'
import '../../src/components/tabs/index.js'

async function createTriggerFixture({ active = 'first', triggerName = 'first' } = {}) {
  const root = document.createElement('rm-tabs-root')
  root.active = active
  root.innerHTML = `
    <rm-tabs-trigger name="${triggerName}" activeClass="tabs__btn--active">
      <button class="tabs__btn" type="button">${triggerName}</button>
    </rm-tabs-trigger>
  `

  document.body.appendChild(root)

  await root.updateComplete

  const trigger = root.querySelector('rm-tabs-trigger')
  const button = trigger.querySelector('button')

  await trigger.updateComplete

  return { root, trigger, button }
}

async function waitForUpdates(...elements) {
  await Promise.all(elements.map(element => element.updateComplete))
}

describe('RmTabsTrigger', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('setActive dispatches rm-tab-select with expected detail', async () => {
    const { root, trigger } = await createTriggerFixture({ active: 'second', triggerName: 'first' })
    const listener = vi.fn()

    trigger.addEventListener('rm-tab-select', listener)
    trigger.setActive()

    await waitForUpdates(root, trigger)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toEqual({ name: 'first' })
    expect(root.active).toBe('first')
  })

  it('isActive reflects rm-tabs-root active tab', async () => {
    const { root, trigger } = await createTriggerFixture({ active: 'first', triggerName: 'first' })

    expect(trigger.isActive).toBe(true)

    root.active = 'second'
    await waitForUpdates(root, trigger)

    expect(trigger.isActive).toBe(false)
  })

  it('toggles activeClass and aria-selected when active tab changes', async () => {
    const { root, trigger, button } = await createTriggerFixture({ active: 'first', triggerName: 'first' })
    const triggerSlot = trigger.shadowRoot.querySelector('slot')

    expect(button.classList.contains('tabs__btn--active')).toBe(true)
    expect(triggerSlot.getAttribute('aria-selected')).toBe('true')

    root.active = 'second'
    await waitForUpdates(root, trigger)

    expect(button.classList.contains('tabs__btn--active')).toBe(false)
    expect(triggerSlot.getAttribute('aria-selected')).toBe('false')
  })
})
