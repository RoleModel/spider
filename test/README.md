# Test Suite

This directory contains the test suite for the Spider web components library, focusing on the PDF Viewer component.

## Overview

The test suite uses [Vitest](https://vitest.dev/) with the following setup:
- **Test Environment**: happy-dom (lightweight DOM implementation)
- **Testing Library**: @open-wc/testing for web component testing
- **Mocking**: Vitest's built-in mocking capabilities

## Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with UI
yarn test:ui

# Run tests with coverage
yarn test:coverage
```

## Test Structure

### Unit Tests (`test/components/`)
Tests for individual components:
- `pdf-viewer.test.js` - Main PDF viewer component
- `pdf-toolbar.test.js` - Toolbar component with controls
- `pdf-canvas.test.js` - Canvas component for rendering pages
- `pdf-sidebar.test.js` - Sidebar with thumbnails
- `theme-config.test.js` - Theme configuration

### Helper Tests (`test/helpers/`)
Tests for utility functions:
- `text-helper.test.js` - Text normalization utilities

### Integration Tests (`test/integration/`)
End-to-end tests:
- `pdf-viewer-integration.test.js` - Complete user workflows

## Test Utilities

### Test Helpers (`test/helpers/test-utils.js`)
Provides utilities for testing:
- `createMockPDFDocument(numPages)` - Creates mock PDF documents
- `createMockPage(pageNumber)` - Creates mock PDF pages
- `mockPDFJS()` - Mocks the PDF.js library
- `waitForElement(shadowRoot, selector, timeout)` - Waits for element in shadow DOM
- `waitForCondition(condition, timeout)` - Waits for a condition to be true

### Setup (`test/setup.js`)
Global test setup including:
- PDF.js worker configuration
- Canvas API mocks
- ResizeObserver and IntersectionObserver mocks

### Mocks (`test/mocks/`)
Mock implementations:
- `pdf.worker.mock.js` - Mock PDF.js worker

## Testing Web Components

### Basic Component Test
```javascript
import { fixture, html } from '@open-wc/testing'
import MyComponent from '../src/components/my-component.js'

it('should render component', async () => {
  const element = await fixture(html`<my-component></my-component>`)
  expect(element).toBeDefined()
})
```

### Testing with Context
```javascript
import { ContextProvider } from '@lit/context'
import { myContext } from '../src/context.js'

async function createComponentWithContext(context) {
  const container = document.createElement('div')
  const provider = new ContextProvider(container, {
    context: myContext,
    initialValue: context
  })
  
  const component = document.createElement('my-component')
  container.appendChild(component)
  document.body.appendChild(container)
  
  await component.updateComplete
  return { component, container }
}
```

### Testing Shadow DOM
```javascript
it('should find element in shadow DOM', async () => {
  const element = await fixture(html`<my-component></my-component>`)
  const shadowRoot = element.shadowRoot
  const button = shadowRoot.querySelector('button')
  expect(button).toBeDefined()
})
```

## Coverage

The test suite includes coverage reporting. Coverage reports are generated in:
- Text format (console output)
- JSON format (`coverage/coverage-final.json`)
- HTML format (`coverage/index.html`)

### Coverage Exclusions
The following are excluded from coverage:
- `node_modules/`
- `dist/`
- Style files (`*.styles.js`)
- Theme configuration
- Build configuration files

## Best Practices

1. **Isolate Tests**: Each test should be independent and not rely on other tests
2. **Clean Up**: Always clean up components after tests to avoid memory leaks
3. **Mock External Dependencies**: PDF.js and other external libraries are mocked
4. **Test User Interactions**: Focus on testing component behavior from user perspective
5. **Use Semantic Assertions**: Use clear, descriptive assertions
6. **Test Edge Cases**: Include boundary conditions and error states

## Debugging Tests

### Debug Single Test
```bash
yarn test path/to/test.js
```

### Debug with UI
```bash
yarn test:ui
```

### Debug in Browser
Add `--browser` flag to run tests in a real browser:
```bash
yarn test --browser
```

## CI/CD Integration

Tests are designed to run in CI/CD environments. The test suite:
- Uses deterministic mocks
- Has reasonable timeouts
- Cleans up after itself
- Provides detailed error messages

## Contributing

When adding new features:
1. Write tests for new components
2. Ensure existing tests pass
3. Maintain or improve coverage
4. Follow existing test patterns
