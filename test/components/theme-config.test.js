import { describe, it, expect } from 'vitest'
import { createThemeStyleSheet } from '../../src/components/pdf-viewer/theme-config.js'

describe('Theme Configuration', () => {
  describe('createThemeStyleSheet', () => {
    it('should create a CSSStyleSheet with default values', () => {
      const sheet = createThemeStyleSheet()

      expect(sheet).toBeInstanceOf(CSSStyleSheet)
      expect(sheet.cssRules.length).toBeGreaterThan(0)
    })

    it('should create a stylesheet with custom hue', () => {
      const sheet = createThemeStyleSheet(150, 89)

      expect(sheet).toBeInstanceOf(CSSStyleSheet)
      expect(sheet.cssRules[0].cssText).toContain('150')
    })

    it('should create a stylesheet with custom saturation', () => {
      const sheet = createThemeStyleSheet(217, 50)

      expect(sheet).toBeInstanceOf(CSSStyleSheet)
      expect(sheet.cssRules[0].cssText).toContain('50%')
    })

    it('should include all theme CSS variables', () => {
      const sheet = createThemeStyleSheet()
      const cssText = sheet.cssRules[0].cssText

      expect(cssText).toContain('--theme-primary')
      expect(cssText).toContain('--theme-neutral-')
      expect(cssText).toContain('--theme-spacing-')
      expect(cssText).toContain('--theme-border-radius-')
      expect(cssText).toContain('--theme-font-size-')
      expect(cssText).toContain('--theme-icon-size-')
    })

    it('should use light-dark() function for color properties', () => {
      const sheet = createThemeStyleSheet()
      const cssText = sheet.cssRules[0].cssText

      expect(cssText).toContain('light-dark')
    })
  })
})
