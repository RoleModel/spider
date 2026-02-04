import { css } from 'lit'

export default css`
  :host {
    display: block;
    cursor: pointer;
  }

  ::selection {
    background: var(--theme-primary, #4285f4);
    color: white;
  }

  .thumbnail-container {
    padding: var(--theme-spacing-sm, 0.5rem);
    border: var(--theme-border-width-md, 2px) solid var(--theme-neutral-200, #efefef);
    border-radius: var(--theme-border-radius-md, 4px);
    transition: all 0.2s ease;
    background: white;
  }

  .thumbnail-container:hover {
    border-color: var(--theme-primary, #4285f4);
    box-shadow: 0 var(--theme-spacing-xs, 0.25rem) var(--theme-spacing-sm, 0.5rem) var(--theme-shadow, rgba(0, 0, 0, 0.1));
  }

  .thumbnail-container.active {
    border-color: var(--theme-primary-dark, #1967d2);
    background: var(--theme-primary-lighter, #e8f0fe);
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--theme-border-radius-sm, 2px);
  }

  .page-label {
    text-align: center;
    margin-top: var(--theme-spacing-xs, 0.25rem);
    font-size: var(--theme-font-size-sm, 12px);
    color: var(--theme-neutral-400, #5f6368);
    font-weight: 500;
  }
`
