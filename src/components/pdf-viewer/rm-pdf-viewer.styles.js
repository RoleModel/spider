import { css } from 'lit'
export default css`
  
  :host {
    display: block;
    width: 100%;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 14px;
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
