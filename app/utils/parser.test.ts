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
})
