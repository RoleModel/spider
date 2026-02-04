import { css } from 'lit'

export default css`
  :host {
    display: block;
  }

  .sidebar {
    width: 200px;
    background: #fafafa;
    border-right: 1px solid #ddd;
    overflow-y: auto;
    height: 100%;
  }

  .thumbnails-container {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`
