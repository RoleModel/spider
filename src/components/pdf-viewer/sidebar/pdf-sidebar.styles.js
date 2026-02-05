import { css } from 'lit'

export default css`
  :host {
    display: block;
    position: relative;
  }

  .sidebar-container {
    position: relative;
  }
  
  .sidebar {
    width: 200px;
    background: var(--theme-neutral-50, #fafafa);
    border-right: var(--theme-border-width-sm, 1px) solid var(--theme-border, #ddd);
    overflow: hidden;
    height: 100%;
    position: relative;
    transition: width 0.3s ease;
  }

  .sidebar.collapsed {
    width: 0;
  }

  .thumbnails-container {
    padding: var(--theme-spacing-md, 1rem);
    display: flex;
    flex-direction: column;
    gap: var(--theme-spacing-md, 1rem);
    opacity: 1;
    transition: opacity 0.2s ease;
    height: calc(100vh - 81px);
    overflow-y: auto;
  }

  .sidebar.collapsed .thumbnails-container {
    opacity: 0;
    pointer-events: none;
  }

  .floating-controls {
    position: absolute;
    left: 100%;
    top: 16px;
    transform: translateY(-50%);
    z-index: 10;
  }

  .btn--icon {
    padding: var(--theme-spacing-xs, 0.25rem);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    border-radius: var(--theme-border-radius-md, 4px);
    transition: background-color 0.2s ease;
  }

  .btn--icon:hover {
    background: var(--theme-neutral-100);
  }

  .btn--icon img {
    width: 24px;
    height: 24px;
  }
`
