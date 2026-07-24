import { describe, it, expect } from 'vitest'
import { CSSResult } from 'lit'
import { createThemeStyles } from '../../src/components/pdf-viewer/theme-config.js'

describe('Theme Configuration', () => {
  describe('createThemeStyles', () => {
    it('should create a CSSResult with default values', () => {
      const styles = createThemeStyles()

      expect(styles).toBeInstanceOf(CSSResult)
      expect(styles.cssText.length).toBeGreaterThan(0)
    })

    it('should create styles with custom hue', () => {
      const styles = createThemeStyles(150, 89)

      expect(styles.cssText).toContain('150')
    })

    it('should create styles with custom saturation', () => {
      const styles = createThemeStyles(217, 50)

      expect(styles.cssText).toContain('50%')
    })

    it('should include all theme CSS variables', () => {
      const cssText = createThemeStyles().cssText

      expect(cssText).toContain('--theme-primary')
      expect(cssText).toContain('--theme-neutral-')
      expect(cssText).toContain('--theme-spacing-')
      expect(cssText).toContain('--theme-border-radius-')
      expect(cssText).toContain('--theme-font-size-')
      expect(cssText).toContain('--theme-icon-size-')
    })

    it('should use light-dark() function for color properties', () => {
      const cssText = createThemeStyles().cssText

      expect(cssText).toContain('light-dark')
    })

    it('should not construct a CSSStyleSheet eagerly (Safari < 16.4 has no constructor)', () => {
      const originalCSSStyleSheet = globalThis.CSSStyleSheet
      globalThis.CSSStyleSheet = function () {
        throw new TypeError('Illegal constructor')
      }

      try {
        expect(() => createThemeStyles(217, 89)).not.toThrow()
      } finally {
        globalThis.CSSStyleSheet = originalCSSStyleSheet
      }
    })
  })
})
