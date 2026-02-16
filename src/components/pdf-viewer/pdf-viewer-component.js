import { ContextConsumer } from '@lit/context'
import { pdfContext } from './pdf-context.js'

import RoleModelElement from "../../internal/rolemodel-element.js"

export class PDFViewerComponent extends RoleModelElement {
  static get styles() {
    return []
  }

  constructor() {
    super()
    this._contextConsumer = new ContextConsumer(this, {
      context: pdfContext,
      callback: (value) => {
        this.context = value
        this.requestUpdate()
      },
      subscribe: true
    })
    this.context = null
  }
}
