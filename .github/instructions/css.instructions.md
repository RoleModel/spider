---
applyTo: '**/*.css,**/*.scss'
---

SCSS is used for styling, but avoid using mixins. Use BEM methodology for class naming.

## CSS Library
We use Optics for our CSS library. It provides a set of components and tokens that should be used
to maintain consistency across the application. Consider if the component you are creating should be a modifier of an existing component before creating a new one.

## CSS Variables
Avoid adding in fallbacks for CSS variables. See the list of available Optics tokens in the
`.github/docs/optics/tokens.json` file.

## Specificity
Never use `!important`. Always make the selector more specific to solve those issues.
