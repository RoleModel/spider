import { css } from 'lit'

export default css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .canvas-container {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: #e9e9e9;
    gap: 1rem;
  }

  .page-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    position: relative;
  }

  canvas {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
    display: block;
  }

  .textLayer {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    opacity: 0.2;
    line-height: 1.0;
    pointer-events: auto;
  }

  .textLayer > div {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }

  .textLayer ::selection {
    background: rgba(0, 100, 255, 0.8);
  }
`
