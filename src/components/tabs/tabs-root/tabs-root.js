import { html, css } from "lit"
import { createContext, ContextProvider } from "@lit/context"

import RoleModelElement from "../../../internal/rolemodel-element"

const tabsContext = createContext(Symbol("tabs-context"))

export default class RmTabsRoot extends RoleModelElement {
  static properties = {
    active: { type: String, reflect: true }
  }

  _activeTabProvider = new ContextProvider(this, {
    context: tabsContext,
    initialValue: ""
  })

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener("rm-tab-select", this.#handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("rm-tab-select", this.#handleClick)
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("active")) {
      this._activeTabProvider.setValue(this.active)
    }
  }

  #handleClick(event) {
    event.stopImmediatePropagation()
    this.active = event.detail.name
  }

  render() {
    return html` <slot></slot> `
  }

  static styles = css`
    :host {
      display: block;
    }
  `
}

export { tabsContext }

customElements.define('rm-tabs-root', RmTabsRoot)
