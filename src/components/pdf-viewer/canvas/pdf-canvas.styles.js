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
    padding: var(--theme-spacing-lg, 2rem);
    background: var(--theme-neutral-100, #f3f3f3);
    gap: var(--theme-spacing-md, 1rem);
  }

  @media (max-width: 512px) {
    .canvas-container {
      align-items: flex-start;
    }
  }
`
