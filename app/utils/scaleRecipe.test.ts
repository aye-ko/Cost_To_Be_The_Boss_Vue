import { describe, it, expect } from "vitest";
import { scaleRecipe } from './scaleRecipe'
import { type Recipe } from  '~/stores/recipes'

describe ('scaleRecipe', () => {
    const fakeRecipe: Recipe = {
        id: 1,
        name: 'Sugar Cookie',
        servingsPerBatch: 12,
        ingredients: [
            { ingredientId: 7, quantity: 2, unit:'tablespoon' }
        ],
        hoursPerBatch: 2,
        profitMargin:0.3,
        batchesPerMonth: 10
    }
    it('scales a recipe up to whole batches', () =>{
        const result = scaleRecipe(150, fakeRecipe)
        expect(result.batches).toBe(13)
        expect(result.ingredients[0].quantity).toBe(26)
    })

})