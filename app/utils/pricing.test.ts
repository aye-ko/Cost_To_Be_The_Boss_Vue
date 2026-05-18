import { describe, it, expect } from 'vitest';
import { priceRecipe } from './pricing';
import type { Ingredient } from '~/stores/pantry';
describe('priceRecipe', () => {
    it('should calculate batch and serving price correctly', () => {
        const recipe = {
            id: 1,
            name: 'test recipe',
            hoursPerBatch: 1,
            servingsPerBatch: 10,
            profitMargin: 0.10,
            ingredients: [{ ingredientId: 1, quantity: 1, unit: 'cup' }]
            };

            const pantry = [
    { id: 1, name: 'Wheat, flour, white', quantity: 1, unit: 'cup', cost: 1 }
];


            const hourlyWage =  10;
            const monthlyOverhead = 100;
            const monthlyHoursWorked = 100;


    const result = priceRecipe(recipe, pantry, hourlyWage, monthlyOverhead, monthlyHoursWorked);

    expect(result.ok).toBe(true);
if (result.ok) {
    expect(result.batchPrice).toBeCloseTo(13.33, 2);
    expect(result.servingPrice).toBeCloseTo(1.33, 2);
}
    });

        // Error case where hourlyWage is null
    it('should return error when hourlyWage is null', () => {
        const recipe = {
            id: 1,
            name: 'test recipe',
            hoursPerBatch: 1,
            servingsPerBatch: 10,
            profitMargin: 0.10,
            ingredients: [{ ingredientId: 1, quantity: 1, unit: 'cup' }]
            };

        const pantry = [
    { id: 1, name: 'Wheat, flour, white', quantity: 1, unit: 'cup', cost: 1 }
];

        const result = priceRecipe(recipe, pantry, null, 100, 100);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe('Hourly wage is required for pricing');
        }
    });

    // Error case where monthlyOverhead is null
    it('should return error when monthlyOverhead is null', () => {
        const recipe = {
            id: 1,
            name: 'test recipe',
            hoursPerBatch: 1,
            servingsPerBatch: 10,
            profitMargin: 0.10,
            ingredients: [{ ingredientId: 1, quantity: 1, unit: 'cup' }]
            }; 
        const pantry = [
    { id: 1, name: 'Wheat, flour, white', quantity: 1, unit: 'cup', cost: 1 }
];
        const result = priceRecipe(recipe, pantry, 10, null, 100);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe('Monthly overhead is required for pricing');
        }
    });

    // Error case where monthlyHoursWorked is null
    it('should return error when monthlyHoursWorked is null', () => {
        const recipe = {
            id: 1,
            name: 'test recipe',
            hoursPerBatch: 1,
            servingsPerBatch: 10,   
            profitMargin: 0.10,
            ingredients: [{ ingredientId: 1, quantity: 1, unit: 'cup' }]
            };  

        const pantry = [
    { id: 1, name: 'Wheat, flour, white', quantity: 1, unit: 'cup', cost: 1 }
];
        const result = priceRecipe(recipe, pantry, 10, 100, null);
        expect(result.ok).toBe(false);  
        if (!result.ok) {
            expect(result.error).toBe('Monthly hours worked is required for pricing');
        }
    });

    // Error case where monthlyHoursWorked is zero
    it('should return error when monthlyHoursWorked is zero', () => {
        const recipe = {
            id: 1,
            name: 'test recipe',
            hoursPerBatch: 1,
            servingsPerBatch: 10,   
            profitMargin: 0.10,
            ingredients: [{ ingredientId: 1, quantity: 1, unit: 'cup' }]
            };  
        const pantry = [
    { id: 1, name: 'Wheat, flour, white', quantity: 1, unit: 'cup', cost: 1 }
];  
        const result = priceRecipe(recipe, pantry, 10, 100, 0);
        expect(result.ok).toBe(false);  
        if (!result.ok) {
            expect(result.error).toBe('Monthly hours worked cannot be zero');
        }
    });   
    // Error case where an ingredient is missing from the pantry
    it('should return error when an ingredient is missing from the pantry', () => {
        const recipe = {
            id: 1,
            name: 'test recipe',
            hoursPerBatch: 1,
            servingsPerBatch: 10,   
            profitMargin: 0.10,
            ingredients: [{ ingredientId: 1, quantity: 1, unit: 'cup' }]
            };  
        const pantry : Ingredient[] = []; // empty pantry  
        const result = priceRecipe(recipe, pantry, 10, 100, 100);
        expect(result.ok).toBe(false);  
        if (!result.ok) {
            expect(result.error).toBe('An ingredient in this recipe is missing from the pantry, please add it to pantry or remove it from the recipe');
        }   

    });

    // Error case where ingredient unit conversion is each to grams
    it('should return error when ingredient unit conversion is incompatible', () => {
        const recipe = {
            id: 1,
            name: 'test recipe',
            hoursPerBatch: 1,
            servingsPerBatch: 10,
            profitMargin: 0.10,
            ingredients: [{ ingredientId: 1, quantity: 1, unit: 'each' }]
            };
        const pantry = [
    { id: 1, name: 'Wheat, flour, white', quantity: 1, unit: 'cup', cost: 1 }
];  
        const result = priceRecipe(recipe, pantry, 10, 100, 100);
        expect(result.ok).toBe(false);  
        if (!result.ok) {
            expect(result.error).toBe("Wheat, flour, white is in your pantry as cup, but recipe calls for  each.  These can't be converted automatically - please use matching units on both sides.");
        } 



    }); 
})
