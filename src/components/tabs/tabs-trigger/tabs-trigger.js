import { html, css } from "lit"
import { ContextConsumer } from "@lit/context"

import RoleModelElement from "../../../internal/rolemodel-element.js"
import { tabsContext } from "../tabs-root/tabs-root.js"
import { RmTabSelectEvent } from "../../../events/index.js"

export default class RmTabsTrigger extends RoleModelElement {
  static properties = {
    name: { type: String, reflect: true },
    activeClass: { type: String, reflect: true }
  }

  _activeTab = new ContextConsumer(this, {
    context: tabsContext,
    subscribe: true,
    callback: (_value) => this.updateSlottedActiveClass()
  })

  updateSlottedActiveClass() {
    const slottedChildren = this._slottedChildren({ flatten: true })

    if (!slottedChildren || !this.activeClass) return

    slottedChildren.forEach((element) => {
      element.classList.toggle(this.activeClass, this.isActive)
    })
  }

  get isActive() {
    return this._activeTab.value === this.name
  }

  setActive() {
    this.dispatchEvent(new RmTabSelectEvent(this.name))
  }

  #handleClick(_event) {
    this.setActive()
  }

  #handleSlotChange(_event) {
    this.updateSlottedActiveClass()
  }

  render() {
    return html`
      <slot @click=${this.#handleClick} @slotchange=${this.#handleSlotChange} aria-selected=${this.isActive}></slot>
    `
  }

  static styles = css`
    :host {
      display: inline-block;
    }
  `
}

customElements.define('rm-tabs-trigger', RmTabsTrigger)
