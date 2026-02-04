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

  .sidebar-toggle {
    position: relative;
  }

  .sidebar-toggle img {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .sidebar-toggle .icon-open {
    display: none;
  }

  .sidebar-toggle .icon-close {
    display: block;
  }

  .sidebar-toggle.collapsed .icon-open {
    display: block;
  }

  .sidebar-toggle.collapsed .icon-close {
    display: none;
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

  .page-input {
    width: 1rem;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.25rem;
    font-size: 0.9rem;
    font-weight: 500;
    background-color: #fafafa;

    &:hover {
      background-color: #f3f3f3;
    }
  }

  .page-input:focus {
    outline: none;
    border-color: #0066cc;
    font-weight: bold;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
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
