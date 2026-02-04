import { css } from 'lit'

export default css`

  :host {
    display: block;
  }

  .toolbar {
    padding: 8px;
    background: #ffffff;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .btn--icon {
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
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

  .toolbar__section {
    display: flex;
    align-items: center;
    gap: 3rem;
  }
  
  .toolbar__section-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .zoom-level {
    min-width: 3rem;
    text-align: center;
    font-weight: 500;
    color: #333;
  }
`
