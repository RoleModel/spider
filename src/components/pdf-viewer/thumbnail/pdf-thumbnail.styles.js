import { css } from 'lit'

export default css`
  :host {
    display: block;
    cursor: pointer;
  }

  .thumbnail-container {
    padding: 8px;
    border: 2px solid transparent;
    border-radius: 4px;
    transition: all 0.2s ease;
    background: white;
  }

  .thumbnail-container:hover {
    border-color: #4285f4;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .thumbnail-container.active {
    border-color: #1967d2;
    background: #e8f0fe;
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 2px;
  }

  .page-label {
    text-align: center;
    margin-top: 4px;
    font-size: 12px;
    color: #5f6368;
    font-weight: 500;
  }
`
