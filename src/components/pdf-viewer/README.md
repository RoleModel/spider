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

### Using the Close URL

By default, clicking the close button hides the viewer. If you want to redirect to a different page when the close button is clicked, use the `close-url` property:

```html
<!-- Redirect to home page when closed -->
<pdf-viewer src="/document.pdf" close-url="/"></pdf-viewer>

<!-- Redirect to documents listing page when closed -->
<pdf-viewer src="/document.pdf" close-url="/documents"></pdf-viewer>
```

### Custom Close Button

You can provide your own custom close button using the `close-button` slot. This allows you to render any HTML element or custom component as the close action:

```html
<rm-pdf-viewer src="/document.pdf">
  <button slot="close-button" onclick="handleCustomClose()">
    Custom Close
  </button>
</rm-pdf-viewer>
```

The slotted element should trigger the close action on its own (e.g., via `onclick` handlers). If no custom close button is provided, the default close button with an icon will be displayed.

### Properties

| Property | Type   | Default | Description              |
|----------|--------|---------|--------------------------|
| `src`    | String | `''`    | Path to the PDF file     |
| `initial-page` | Number | `1` | Initial page to display when PDF loads |
| `close-url` | String | `''` | URL to redirect to when close button is clicked. If not set, viewer closes with default behavior |
| `theme-hue` | Number | `217` | Hue value (0-360) for the theme color |
| `theme-saturation` | Number | `89` | Saturation value (0-100) for the theme color |

### Slots

| Slot Name | Description |
|-----------|-------------|
| `close-button` | Custom close button element. If not provided, a default close button with icon is displayed |

### Theme Customization

The PDF viewer supports theme customization through HSL (Hue, Saturation, Lightness) values. You can set the primary theme color by adjusting the hue and saturation:

```html
<!-- Blue theme (default) -->
<rm-pdf-viewer src="/document.pdf" theme-hue="217" theme-saturation="89"></rm-pdf-viewer>

<!-- Green theme -->
<rm-pdf-viewer src="/document.pdf" theme-hue="142" theme-saturation="76"></rm-pdf-viewer>

<!-- Purple theme -->
<rm-pdf-viewer src="/document.pdf" theme-hue="271" theme-saturation="76"></rm-pdf-viewer>

<!-- Red theme -->
<rm-pdf-viewer src="/document.pdf" theme-hue="4" theme-saturation="90"></rm-pdf-viewer>
```

The component automatically generates a complete color scale based on your theme values:
- `--theme-primary`: Main theme color
- `--theme-primary-light`: Lighter variant
- `--theme-primary-lighter`: Even lighter variant
- `--theme-primary-dark`: Darker variant
- `--theme-primary-darker`: Even darker variant
- `--theme-neutral-*`: Grayscale colors (50-600)
- `--theme-border`: Border color
- `--theme-shadow`: Shadow color

These CSS variables are automatically applied to:
- Active page indicators
- Focus states on inputs
- Hover states on thumbnails
- Border highlights

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
