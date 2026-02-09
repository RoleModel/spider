import { LitElement } from 'lit'
import { ContextConsumer } from '@lit/context'
import { pdfContext } from './pdf-context.js'

export class PDFViewerComponent extends LitElement {
  static get styles() {
    return []
  }

  constructor() {
    super()
    this._contextConsumer = new ContextConsumer(this, {
      context: pdfContext,
      callback: (value) => {
        this.context = value
      },
      subscribe: true
    })
    this.context = null
  }
}
