import { describe, it, expect } from 'vitest'
import { validateIngredientName } from './validateIngredientName'
// regex to only allow letters, numbers, spaces,parentheses, hyphens, commas, colons, and periods

describe('validateIngredientName', () => {
    it('accepts a plain name', () => {
        expect(validateIngredientName('Saffron')).toBe(true)
    })

    it('accepts a name with parentheses', () => {
        expect(validateIngredientName('Saffron (ground)')).toBe(true)
    })

    it('accepts a name with hyphens', () => {
        expect(validateIngredientName('Saffron - ground')).toBe(true)
    })

    it('accepts a name with commas', () => {
        expect(validateIngredientName('Saffron, ground')).toBe(true)
    })

    it('accepts a name with colons', () => {
        expect(validateIngredientName('Saffron: ground')).toBe(true)
    })

    it('accepts a name with periods', () => {
        expect(validateIngredientName('Saffron. ground')).toBe(true)
    })

    it('rejects a name with special characters', () => {
        expect(validateIngredientName('Saffron!')).toBe(false)
    })

    it('allows a name with numbers', () => {
        expect(validateIngredientName('Saffron 2')).toBe(true)
    })

    it('rejects a name with white spaces', () => {
        expect(validateIngredientName(' ')).toBe(false)
    })

    it('rejects a name with only special characters', () => {
        expect(validateIngredientName('!@#$^&*()')).toBe(false)
    })

    it('rejects a name with only numbers', () => {
        expect(validateIngredientName('12345')).toBe(false)
    })

    it('rejects an empty string', () => {
        expect(validateIngredientName('')).toBe(false)
    })

    it('rejects emojis', () => {
        expect(validateIngredientName('🍕')).toBe(false)
    })

    it('accepts apostrophes', () => {
        expect(validateIngredientName("confectioner's sugar")).toBe(true)
    })

    it('accepts slashes', () => {
        expect(validateIngredientName('Corn/maize, flour')).toBe(true)
    })
})