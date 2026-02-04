import { css } from 'lit'

export default css`
  :host {
    display: block;
    cursor: pointer;
  }

  .thumbnail-container {
    padding: 8px;
    border: 2px solid var(--theme-neutral-200, #efefef);
    border-radius: 4px;
    transition: all 0.2s ease;
    background: white;
  }

  .thumbnail-container:hover {
    border-color: var(--theme-primary, #4285f4);
    box-shadow: 0 2px 8px var(--theme-shadow, rgba(0, 0, 0, 0.1));
  }

  .thumbnail-container.active {
    border-color: var(--theme-primary-dark, #1967d2);
    background: var(--theme-primary-lighter, #e8f0fe);
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 2px;
  }

  .page-label {
    text-align: center;
    margin-top: 4px;
    font-size: 12px;
    color: var(--theme-neutral-400, #5f6368);
    font-weight: 500;
  }
`
