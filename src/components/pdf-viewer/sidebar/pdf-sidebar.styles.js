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
`
