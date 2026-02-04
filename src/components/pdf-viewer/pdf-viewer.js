import { LitElement, html } from 'lit'
import styles from './pdf-viewer.styles.js'

export default class PDFViewer extends LitElement {
  static get styles() {
    return styles;
  }

  render() {
    return html`
      <div class="test">We are ago</div>
    `
  }
}

customElements.define('pdf-viewer', PDFViewer);

