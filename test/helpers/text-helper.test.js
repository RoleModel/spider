import { describe, it, expect } from 'vitest'
import { normalizeText } from '../../src/components/pdf-viewer/helpers/text-helper.js'

describe('Text Helper', () => {
  describe('normalizeText', () => {
    it('should normalize curly single quotes to straight quotes', () => {
      const text = 'It\u2018s a \u2019test\u2019'
      const result = normalizeText(text)
      expect(result).toBe("It's a 'test'")
    })

    it('should normalize curly double quotes to straight quotes', () => {
      const text = '\u201CHello World\u201D'
      const result = normalizeText(text)
      expect(result).toBe('"Hello World"')
    })

    it('should handle text with multiple quote types', () => {
      const text = '\u201CShe said, \u2018Hello\u2019\u201D'
      const result = normalizeText(text)
      expect(result).toBe('"She said, \'Hello\'"')
    })

    it('should return unchanged text without special quotes', () => {
      const text = 'Regular text without quotes'
      const result = normalizeText(text)
      expect(result).toBe('Regular text without quotes')
    })

    it('should handle empty string', () => {
      const result = normalizeText('')
      expect(result).toBe('')
    })
  })
})
