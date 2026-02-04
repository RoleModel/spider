import { css } from 'lit'

export default css`
  :host {
    display: block;
  }

  .page-wrapper {
    position: relative;
    margin-bottom: 16px;
  }

  canvas {
    display: block;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .textLayer {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    opacity: 0.2;
    line-height: 1;
    text-align: initial;
    pointer-events: none;
  }

  .textLayer > div {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
  }
`
