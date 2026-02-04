import { css } from 'lit'

export default css`
  :host {
    display: block;
  }

  .page-wrapper {
    position: relative;
    margin-bottom: var(--theme-spacing-md, 1rem);
  }

  canvas {
    display: block;
    box-shadow: 0 var(--theme-spacing-xs, 0.25rem) var(--theme-spacing-sm, 0.5rem) var(--theme-shadow, rgba(0, 0, 0, 0.1));
  }

  .text-layer {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    opacity: 0.2;
    line-height: 1;
    text-align: initial;
    pointer-events: auto;
  }

  .text-layer > div {
    color: transparent;
    position: absolute;
    white-space: pre;
    cursor: text;
    transform-origin: 0% 0%;
    user-select: text;
  }

  .text-layer > div::selection {
    background-color: var(--theme-primary-transparent);
  }
`
