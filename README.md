# Spider Web Components
By RoleModel Software 

# PDF Viewer

[PDF.js](https://mozilla.github.io/pdf.js) is awesome, but you will notice this paragraph in their setup instructions:
> The viewer is built on the display layer and is the UI for PDF viewer in Firefox and the other browser extensions within the project. It can be a good starting point for building your own viewer. However, we do ask if you plan to embed the viewer in your own site, that it not just be an unmodified version. Please re-skin it or build upon it.

This component aims to be that skin layer built upon PDF.js packaged in a lovely drop-in web component.

A customizable PDF viewer web component built on [PDF.js](https://mozilla.github.io/pdf.js). This component provides a reskinned, embeddable PDF viewing experience with text selection, zoom controls, thumbnail navigation, and theme customization.

## Installation

```bash
yarn add @rolemodel/spider
```

```html
<!doctype html>
<html>
  <body>
    <rm-pdf-viewer src="/path/to/document.pdf"></rm-pdf-viewer>
  </body>
</html>
```

### With Custom Close Button

```html
<rm-pdf-viewer src="/document.pdf">
  <button slot="close-button" onclick="window.location.href='/'">
    Back to Home
  </button>
</rm-pdf-viewer>
```

## Testing

The test suite uses [Vitest](https://vitest.dev/) with @open-wc/testing for web component testing. Run `yarn test` to execute all tests, or use `yarn test --watch` for watch mode. Tests include unit tests for individual components, helper utilities, and integration tests for complete user workflows. Coverage reports can be generated with `yarn test:coverage`.

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | String | `''` | Path to the PDF file |
| `initial-page` | Number | `1` | Initial page to display |
| `close-url` | String | `''` | URL to redirect when close button is clicked |
| `theme-hue` | Number | `217` | Hue value (0-360) for theme color |
| `theme-saturation` | Number | `89` | Saturation value (0-100) for theme color |

## Slots

| Slot | Description |
|------|-------------|
| `close-button` | Custom close button element |

## License

MIT
