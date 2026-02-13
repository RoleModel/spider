import { html, css } from "lit"
import { ContextConsumer } from "@lit/context"

import RoleModelElement from "../../../internal/rolemodel-element.js"
import { tabsContext } from "../tabs-root/tabs-root.js"
import { RmTabSelectEvent } from "../../../events/index.js"

export default class RmTabsPanel extends RoleModelElement {
  static properties = {
    name: { type: String, reflect: true }
  }

  _activeTab = new ContextConsumer(this, { context: tabsContext, subscribe: true })

  get active() {
    return this._activeTab.value === this.name
  }

  activate() {
    this.dispatchEvent(new RmTabSelectEvent(this.name))
  }

  render() {
    return html`
      <div role="tabpanel" ?hidden=${!this.active} aria-hidden=${!this.active}>
        <slot></slot>
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
    }
  `
}

customElements.define('rm-tabs-panel', RmTabsPanel)
