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

  .error-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--theme-neutral-50, #fafafa);
    padding: var(--theme-spacing-lg, 2rem);
  }

  .error-content {
    max-width: 400px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--theme-spacing-md, 1rem);
  }

  .error-icon {
    width: 64px;
    height: 64px;
    color: var(--theme-primary, #2463eb);
    opacity: 0.8;
  }

  .error-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--theme-neutral-600, #333);
  }

  .error-message {
    margin: 0;
    color: var(--theme-neutral-500, #666);
    line-height: 1.5;
  }

  .error-retry {
    margin-top: var(--theme-spacing-sm, 0.5rem);
    padding: var(--theme-spacing-sm, 0.5rem) var(--theme-spacing-md, 1rem);
    background: var(--theme-primary, #2463eb);
    color: white;
    border: none;
    border-radius: var(--theme-border-radius-md, 4px);
    font-size: var(--theme-font-size-md, 14px);
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .error-retry:hover {
    background: var(--theme-primary-dark, #1d4ed8);
  }

  .error-retry:active {
    background: var(--theme-primary-darker, #1e40af);
  }

  .loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: var(--theme-neutral-50, #fafafa);
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--theme-neutral-200, #e5e5e5);
    border-top-color: var(--theme-primary, #0066cc);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-spinner p {
    margin-top: 1rem;
    color: var(--theme-neutral-600, #555);
    font-size: var(--theme-font-size-base, 14px);
  }
`
