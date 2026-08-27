import { describe, it, expect } from 'vitest'
import {parseIngredientLine} from './parser'

describe('parseIngredientLine', () => {
    it('parse a simple name-unit-quantity line', () => {
        const result = parseIngredientLine('2 cups of onion powder')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('onion powder')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('cup')
    })

    it('raise a warning for 2 eggs', () => {
        const result = parseIngredientLine('2 eggs')
        expect(result.verdict).toBe('warning')
        expect(result.nameGuess).toBe('eggs')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('each')
        expect(result.warnings).toContain('no unit specified')
    })
    it('parses a fraction glyph quantity', () => {
        const result = parseIngredientLine('1 ½ teaspoon creole seasoning')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('creole seasoning')
        expect(result.quantity).toBe(1.5)
        expect(result.unit).toBe('teaspoon')
    })
})
