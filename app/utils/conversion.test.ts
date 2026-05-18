import { describe, it, expect } from 'vitest'
import { convert } from './conversion'

describe('convert', () => {
    it('returns identical quantities when units match', () => {
        const result = convert('Wheat, flour, white', 2, 'cup', 5, 'cup')
        expect(result).toEqual({ recipe_g: 2, pantry_g: 5 })
    })

    it('returns null for incompatible units', () => {
        const result = convert('Wheat, flour, white', 2, 'cup', 5, 'each')
        expect(result).toBeNull()
    })
    it('converts volume to weight using density', () => {
        const result = convert('Wheat, flour, white', 1, 'cup', 500, 'gram') // density is 0.67
        expect(result).toEqual({ recipe_g: 236.588 * 0.67, pantry_g: 500 }) 
    })
    it('returns null for unknown units', () => {
        const result = convert('Wheat, flour, white', 1, 'unknownUnit', 500, 'gram')
        expect(result).toBeNull()
    })

    it('returns grams for weight units', () => {
        const result = convert('Sugar', 2, 'ounce', 100, 'kilogram')
        expect(result).toEqual({ recipe_g: 56.699, pantry_g: 100000 })
    })
    
})