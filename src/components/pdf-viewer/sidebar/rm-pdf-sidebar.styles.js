import { css } from 'lit'

export default css`
  :host {
    display: block;
  }

  .sidebar {
    width: 200px;
    background: #fafafa;
    border-right: 1px solid #ddd;
    overflow: hidden;
    height: 100%;
    position: relative;
    transition: width 0.3s ease;
  }

  .sidebar.collapsed {
    width: 0;
  }

  .thumbnails-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  .sidebar.collapsed .thumbnails-container {
    opacity: 0;
    pointer-events: none;
  }
`
