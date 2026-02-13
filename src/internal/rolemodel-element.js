import { LitElement } from 'lit'

export default class RoleModelElement extends LitElement {
  constructor() {
    super()
    this._onConstructor()
    this.#initializeDefaults(this.constructor.properties)
    this.#initializeElementInternals()
  }

  _onConstructor() {
    // Callback called after super but before initializing defaults and element internals.
  }

  // E.G { flatten: true }
  _slottedChildren(options = {}) {
    const slot = this.shadowRoot.querySelector("slot")

    return slot?.assignedElements(options)
  }

  // Initializing default property values from the static properties object
  #initializeDefaults(defaults) {
    if (!defaults) return

    for (const [key, value] of Object.entries(defaults)) {
      if (this[key] !== undefined) continue

      if (value.default !== undefined) {
        // Array and object defaults need to be initialized as a new instance,
        // otherwise they will be shared across all instances of the component
        if (typeof value.default === "function") {
          this[key] = value.default()
        } else {
          this[key] = value.default
        }
      }
    }
  }

  #initializeElementInternals() {
    // Use `static formAssociated = true` in your component to opt in to form association.
    // If your component is form-associated, you can set the form value like this:
    // this.internals.setFormValue(this.value)

    try {
      this.internals = this.attachInternals()
    } catch {
      console.error('Element internals are not supported in your browser. Consider using a polyfill')
    }
  }
}
