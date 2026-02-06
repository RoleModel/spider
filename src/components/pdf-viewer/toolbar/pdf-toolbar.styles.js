import { css } from 'lit'

export default css`

  :host {
    display: block;
  }

  .toolbar {
    position: relative;
    padding: var(--theme-spacing-sm);
    background: var(--theme-neutral-50);
    border-bottom: var(--theme-border-width-sm, 1px) solid var(--theme-border, #ddd);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  button {
    padding: var(--theme-spacing-sm, 0.5rem) var(--theme-spacing-md, 1rem);
    border: var(--theme-border-width-sm, 1px) solid var(--theme-neutral-300, #ccc);
    background: var(--theme-neutral-50);
    border-radius: var(--theme-border-radius-md, 4px);
    cursor: pointer;
    font-size: var(--theme-font-size-base, 0.9rem);
    &:hover {
      box-shadow: 0 0 0 2px var(--theme-border);
    }
  }

  .btn--icon {
    padding: var(--theme-spacing-xs, 0.25rem);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--theme-icon-color);

    svg {
      width: var(--theme-icon-size-lg, 18px);
      height: var(--theme-icon-size-lg, 18px);
    }
  }

  .btn--search {
    background: var(--theme-neutral-100);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--theme-spacing-xs, 0.25rem);
  }

  .btn--search--active {
    background: var(--theme-primary-50, #e6f0ff);
    color: var(--theme-primary, #0066cc);
  }

  .btn--search--active .btn--search-badge {
    background: var(--theme-primary, #0066cc);
    color: var(--theme-neutral-50, #ffffff);
  }

  .btn--search-badge {
    background: var(--theme-neutral-200);
    color: var(--theme-neutral-600);
    font-size: 9px;
    font-weight: 600;
    padding: 1px 3px;
    border-radius: var(--theme-border-radius-sm, 2px);
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
    font-size: var(--theme-font-size-sm, 12px);
  }

  .page-input {
    width: var(--theme-spacing-md, 1rem);
    text-align: center;
    border: var(--theme-border-width-sm, 1px) solid var(--theme-neutral-300, #ccc);
    border-radius: var(--theme-border-radius-md, 4px);
    padding: var(--theme-spacing-xs, 0.25rem);
    font-size: var(--theme-font-size-sm, 12px);
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
    gap: var(--theme-spacing-sm, 0.5rem);
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

  .search-info {
    min-width: 4rem;
    text-align: center;
    font-weight: 500;
    color: var(--theme-neutral-500, #333);
    font-size: var(--theme-font-size-sm, 12px);
  }

  .search-dropdown {
    position: absolute;
    top: 100%;
    right: var(--theme-spacing-sm, 0.5rem);
    display: flex;
    align-items: center;
    gap: var(--theme-spacing-sm, 0.5rem);
    padding: var(--theme-spacing-sm, 0.5rem);
    background: var(--theme-neutral-50, #ffffff);
    border: var(--theme-border-width-sm, 1px) solid var(--theme-neutral-300, #ccc);
    border-radius: var(--theme-border-radius-md, 4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
    z-index: 11;
  }

  .search-dropdown--open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .search-dropdown__input {
    padding: var(--theme-spacing-sm, 0.5rem);
    border: var(--theme-border-width-sm, 1px) solid var(--theme-neutral-300, #ccc);
    border-radius: var(--theme-border-radius-md, 4px);
    font-size: var(--theme-font-size-md, 14px);
    outline: none;
  }

  .search-dropdown__input:focus {
    border-color: var(--theme-primary, #0066cc);
  }

  @media (max-width: 512px) {
    .toolbar__section {
      gap: var(--theme-spacing-sm, 0.5rem);
    }

    .zoom-level {
      display: none;
    }

    .btn--download {
      display: none;
    }

    .btn--search-badge {
      display: none;
    }
  }
`
