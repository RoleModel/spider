import { css } from 'lit'

export default css`
  :host {
    display: block;
  }

  .toolbar {
    padding: 1rem;
    background: #f5f5f5;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  button:hover:not(:disabled) {
    background: #e9e9e9;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    font-weight: 500;
    color: #333;
  }

  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }

  .zoom-level {
    min-width: 3rem;
    text-align: center;
    font-weight: 500;
    color: #333;
  }
`
