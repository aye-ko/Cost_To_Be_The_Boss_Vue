import { describe, it, expect } from 'vitest'
import { matchPantry } from './matchPantry'
import { type Ingredient } from '~/stores/pantry'

const fakePantry: Ingredient[] = [
    {id: 7, name:'White Wine', quantity:1, unit:'cup', cost: 8.00},
    {id: 12, name:'Sugar', quantity: 5, unit:'pound', cost: 10.00}
]
describe('matchPantry', () => {
    it('matches ignoring case', () => {
        const result = matchPantry('white wine', fakePantry)
        expect(result).toBe(7)
    })

    it('return null when the pantry is empty', ()=> {
        const result = matchPantry('anything', [])
        expect(result).toBe(null)
    })

    it('returns null when the name is not in the pantry', () =>
    {
        const result = matchPantry('dragon fruit', fakePantry)
        expect(result).toBe(null)
    })
})
