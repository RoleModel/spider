import { css } from 'lit'

export default css`
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap');

  :host {
    display: block;
    font-family: 'Rubik', sans-serif;
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
