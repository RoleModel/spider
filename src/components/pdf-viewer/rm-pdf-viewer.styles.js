import { css } from 'lit'
export default css`
  :host {
    display: block;
    width: 100%;
    height: 100vh;
  }
  .pdf-viewer-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .content-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
`
