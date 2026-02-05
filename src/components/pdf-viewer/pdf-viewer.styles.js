import { css } from 'lit'
export default css`
  
  :host {
    display: block;
    width: 100%;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: var(--theme-font-size-md, 14px);
  }
  
  :host(:not([open])) {
    display: none;
  }
  
  .pdf-viewer-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }
  
  .content-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
`
