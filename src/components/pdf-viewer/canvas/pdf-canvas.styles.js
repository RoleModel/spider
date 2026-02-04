import { css } from 'lit'

export default css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }

  .canvas-container {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: #e9e9e9;
    gap: 1rem;
  }
`
