import { css } from 'lit';

export default css`
  :host {
    display: block;
    width: 100%;
    height: 100vh;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .pdf-viewer-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #525659;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: #323639;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #0d6efd;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: #0b5ed7;
  }

  button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .page-info,
  .zoom-level {
    padding: 0.5rem;
    color: white;
    font-size: 14px;
  }

  .canvas-container {
    flex: 1;
    overflow: auto;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  #pdf-canvas {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    background: white;
  }
`;
