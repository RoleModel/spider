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
    position: relative;
    z-index: 0;
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
    z-index: 1;
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

  .annotation-layer {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    pointer-events: auto;
  }

  .annotation-layer a {
    text-decoration: none;
  }

  .annotation-link {
    position: absolute;
    display: block;
    pointer-events: auto;
  }
`
