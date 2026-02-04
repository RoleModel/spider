# PDF Viewer Web Component

A composable PDF viewer web component built with Lit and PDF.js.

## Features

- 📄 Full PDF rendering with PDF.js
- 📝 Text selection and copying
- 🖼️ Thumbnail navigation sidebar
- 🔍 Zoom controls (in/out)
- ⏮️ Page navigation (previous/next)
- 📱 Responsive layout
- 🎨 Customizable through CSS
- 🔧 Composable architecture
- 🎯 Framework agnostic

## Installation

Simply copy the entire `pdf-viewer` directory into your project.

## Usage

### Basic Usage

```html
<!doctype html>
<html>
  <head>
    <script type="module" src="/path/to/pdf-viewer/pdf-viewer.js"></script>
  </head>
  <body>
    <pdf-viewer src="/path/to/document.pdf"></pdf-viewer>
  </body>
</html>
```

### Properties

| Property | Type   | Description              |
|----------|--------|--------------------------|
| `src`    | String | Path to the PDF file     |

### Events

The component emits the following events:

#### `pdf-loaded`
Fired when PDF is successfully loaded.
```javascript
viewer.addEventListener('pdf-loaded', (e) => {
  console.log(`Total pages: ${e.detail.totalPages}`)
})
```

#### `page-change`
Fired when the current page changes.
```javascript
viewer.addEventListener('page-change', (e) => {
  console.log(`Current page: ${e.detail.pageNumber}`)
})
```

#### `scale-change`
Fired when zoom scale changes.
```javascript
viewer.addEventListener('scale-change', (e) => {
  console.log(`Zoom: ${Math.round(e.detail.scale * 100)}%`)
})
```

#### `pdf-error`
Fired when PDF fails to load.
```javascript
viewer.addEventListener('pdf-error', (e) => {
  console.error('Failed to load PDF:', e.detail.error)
})
```

### JavaScript API

```javascript
const viewer = document.querySelector('pdf-viewer')

// Change PDF source dynamically
viewer.src = '/path/to/different.pdf'
```

## Architecture

The component uses a composable architecture with a root component and child components:

```
pdf-viewer (root)
├── toolbar     - Navigation and zoom controls
├── sidebar     - Thumbnail navigation
│   └── thumbnail
├── canvas      - Main PDF display
```

### Component Structure

```
pdf-viewer/
├── pdf-viewer.js              # Root component
├── pdf-viewer.styles.js       # Root styles
├── index.js                   # Exports
├── toolbar/                   # Toolbar component
│   ├── pdf-toolbar.js
│   └── pdf-toolbar.styles.js
├── sidebar/                   # Sidebar component
│   ├── pdf-sidebar.js
│   └── pdf-sidebar.styles.js
├── canvas/                    # Canvas component
│   ├── pdf-canvas.js
│   └── pdf-canvas.styles.js
└── thumbnail/                 # Thumbnail component
    ├── pdf-thumbnail.js
    └── pdf-thumbnail.styles.js
```

## Dependencies

- [Lit](https://lit.dev/) - Web component framework
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering library

## Browser Support

Works in all modern browsers that support:
- Web Components (Custom Elements v1)
- Shadow DOM v1
- ES Modules

## Customization

The component uses Shadow DOM with CSS custom properties for styling. Each sub-component has its own styles file that can be customized.

## Context API

Child components access shared state through a Symbol-based context pattern. See `COMPONENT-ARCHITECTURE.md` for technical details.

## Text Selection

The PDF viewer implements a text layer overlay system similar to the official PDF.js viewer, allowing users to select and copy text directly from the PDF:

- Text is rendered in an invisible layer positioned precisely over the PDF canvas
- Selection highlighting appears when text is selected
- Users can copy selected text to clipboard using standard browser shortcuts (Cmd/Ctrl+C)
- Text layer automatically scales with zoom level
- No additional configuration required - works out of the box

The text layer is implemented in the `pdf-canvas` component using PDF.js's `getTextContent()` API to extract and position text elements.

## License

See the main project LICENSE file.

## Credits

Built by RoleModel Software
