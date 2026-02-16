import '../../src/components/tabs/index.js'

export async function createTabsFixture({ active = 'first' } = {}) {
  const root = document.createElement('rm-tabs-root')
  root.active = active
  root.className = 'tabs'
  root.innerHTML = `
    <div role="tablist" class="tabs__list">
      <rm-tabs-trigger name="first" activeClass="tabs__btn--active">
        <button class="tabs__btn" type="button">First</button>
      </rm-tabs-trigger>
      <rm-tabs-trigger name="second" activeClass="tabs__btn--active">
        <button class="tabs__btn" type="button">Second</button>
      </rm-tabs-trigger>
    </div>
    <rm-tabs-panel name="first">
      <div class="tabs__panel">
        <span>First panel content</span>
      </div>
    </rm-tabs-panel>
    <rm-tabs-panel name="second">
      <div class="tabs__panel">
        <span>Second panel content</span>
      </div>
    </rm-tabs-panel>
  `

  document.body.appendChild(root)

  await root.updateComplete

  const triggers = [...root.querySelectorAll('rm-tabs-trigger')]
  const panels = [...root.querySelectorAll('rm-tabs-panel')]

  await Promise.all([
    ...triggers.map(trigger => trigger.updateComplete),
    ...panels.map(panel => panel.updateComplete)
  ])

  return {
    root,
    firstTrigger: triggers[0],
    secondTrigger: triggers[1],
    firstPanel: panels[0],
    secondPanel: panels[1],
    firstButton: triggers[0].querySelector('button'),
    secondButton: triggers[1].querySelector('button')
  }
}

export async function waitForUpdates(...elements) {
  await Promise.all(elements.map(element => element.updateComplete))
}
