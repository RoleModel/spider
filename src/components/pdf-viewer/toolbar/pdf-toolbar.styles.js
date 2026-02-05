import { css } from 'lit'

export default css`

  :host {
    display: block;
  }

  .toolbar {
    padding: var(--theme-spacing-sm, 0.5rem);
    background: var(--theme-neutral-50, #ffffff);
    border-bottom: var(--theme-border-width-sm, 1px) solid var(--theme-border, #ddd);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  button {
    padding: var(--theme-spacing-sm, 0.5rem) var(--theme-spacing-md, 1rem);
    border: var(--theme-border-width-sm, 1px) solid var(--theme-neutral-300, #ccc);
    background: white;
    border-radius: var(--theme-border-radius-md, 4px);
    cursor: pointer;
    font-size: var(--theme-font-size-base, 0.9rem);
  }

  .btn--icon {
    padding: var(--theme-spacing-xs, 0.25rem);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
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
    background: var(--theme-neutral-100, #e9e9e9);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    font-weight: 500;
    color: var(--theme-neutral-500, #333);
  }

  .page-input {
    width: var(--theme-spacing-md, 1rem);
    text-align: center;
    border: var(--theme-border-width-sm, 1px) solid var(--theme-neutral-300, #ccc);
    border-radius: var(--theme-border-radius-md, 4px);
    padding: var(--theme-spacing-xs, 0.25rem);
    font-size: var(--theme-font-size-base, 0.9rem);
    font-weight: 500;
    background-color: var(--theme-neutral-50, #fafafa);

    &:hover {
      background-color: var(--theme-neutral-100, #f3f3f3);
    }
  }

  .page-input:focus {
    outline: none;
    border-color: var(--theme-primary, #0066cc);
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
    gap: var(--theme-spacing-xl, 3rem);
  }

  .toolbar__section-group {
    display: flex;
    align-items: center;
    gap: var(--theme-spacing-sm, 0.5rem);
  }

  .zoom-level {
    min-width: var(--theme-spacing-xl, 3rem);
    text-align: center;
    font-weight: 500;
    color: var(--theme-neutral-500, #333);
  }
`
