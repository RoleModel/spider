import { css } from 'lit'

export default css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .canvas-container {
    flex: 1;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem;
    background: #e9e9e9;
  }

  canvas {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
  }
`
