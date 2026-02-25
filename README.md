# Spider Web Components

By RoleModel Software

Spider is a set of reusable web components built with Lit. It currently provides:

- `rm-pdf-viewer`: reskinned PDF viewer built on [PDF.js](https://mozilla.github.io/pdf.js)
- `rm-tabs-root`, `rm-tabs-trigger`, `rm-tabs-panel`: unstyled behavior-first tabs primitives

A customizable PDF viewer web component built on [PDF.js](https://mozilla.github.io/pdf.js). This component provides a reskinned, embeddable PDF viewing experience with text selection, zoom controls, thumbnail navigation, and theme customization.

## Installation

```bash
yarn add @rolemodel/spider
```

## Usage

Import once to register all components:

```js
import '@rolemodel/spider'
```

Or import specific component modules from the package distribution output.

## Development

```bash
yarn dev
yarn test
```

## Components

### PDF Viewer `rm-pdf-viewer`

[PDF.js](https://mozilla.github.io/pdf.js) is awesome, but you will notice this paragraph in their setup instructions:
> The viewer is built on the display layer and is the UI for PDF viewer in Firefox and the other browser extensions within the project. It can be a good starting point for building your own viewer. However, we do ask if you plan to embed the viewer in your own site, that it not just be an unmodified version. Please re-skin it or build upon it.

This component aims to be that skin layer built upon PDF.js packaged in a lovely drop-in web component.

#### Basic usage

```html
<!doctype html>
<html>
  <body>
    <rm-pdf-viewer src="/path/to/document.pdf"></rm-pdf-viewer>
  </body>
</html>
```

#### With custom close button

```html
<rm-pdf-viewer src="/document.pdf">
  <button slot="close-button" onclick="window.location.href='/'">
    Back to Home
  </button>
</rm-pdf-viewer>
```

#### Attributes / properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `''` | PDF URL/path |
| `open` | `boolean` | `false` | Shows the viewer when present/true |
| `initial-page` | `number` | `1` | Initial page to open |
| `theme-hue` | `number` | `217` | Theme hue (`0-360`) |
| `theme-saturation` | `number` | `89` | Theme saturation (`0-100`) |
| `escape-closes-viewer` | `boolean` | `false` | Closes viewer on `Escape` when search is not open |
| `wasm-url` | `string` | Bundled | Base URL for WASM binaries. Only override with a trusted source. |

#### Slot

| Slot | Description |
|------|-------------|
| `close-button` | Custom close action element rendered in the toolbar |

#### Public methods

| Method | Description |
|--------|-------------|
| `loadPDF()` | Loads the PDF from `src` |
| `printPDF()` | Opens browser print flow for the loaded PDF |
| `downloadPDF()` | Downloads the current `src` |
| `fitPDFToScreen()` | Applies calculated fit-to-screen zoom |
| `performSearch(term)` | Searches text across pages |
| `goToNextMatch()` / `goToPreviousMatch()` | Navigates search matches |

### Tabs components

Tabs are split into three composable components so behavior is provided without enforcing styling.

#### `rm-tabs-root`

Owns the active tab state and coordinates triggers/panels.

| Name | Type | Description |
|------|------|-------------|
| `active` | `string` | Current active tab name |

#### `rm-tabs-trigger`

Declares a selectable tab trigger.

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Tab name this trigger controls |
| `activeClass` | `string` | Class toggled on slotted elements when active |

| Member | Type | Description |
|--------|------|-------------|
| `isActive` | getter | `true` when this trigger is selected |
| `activate()` | method | Dispatches a tab select event for this trigger |

#### `rm-tabs-panel`

Declares content for a tab.

| Name | Type | Description |
|------|------|-------------|
| `name` | `string` | Tab name this panel belongs to |

| Member | Type | Description |
|--------|------|-------------|
| `active` | getter | `true` when this panel is visible |
| `activate()` | method | Dispatches a tab select event for this panel |

#### Tabs event

| Event | Detail | Description |
|-------|--------|-------------|
| `rm-tab-select` | `{ name: string }` | Emitted by triggers/panels to request active tab changes |

#### Tabs usage example

```html
<rm-tabs-root class="tabs" active="first">
  <div role="tablist">
    <rm-tabs-trigger name="first" activeClass="active">
      <button type="button">First</button>
    </rm-tabs-trigger>
    <rm-tabs-trigger name="second" activeClass="active">
      <button type="button">Second</button>
    </rm-tabs-trigger>
  </div>

  <rm-tabs-panel name="first">
    <span>First tab content</span>
  </rm-tabs-panel>

  <rm-tabs-panel name="second">
    <span>Second tab content</span>
  </rm-tabs-panel>
</rm-tabs-root>
```

## License

MIT
