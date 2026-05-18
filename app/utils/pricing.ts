import type { Recipe, RecipeIngredient } from '~/stores/recipes'
import type { Ingredient } from '~/stores/pantry'
import { convert } from '~/utils/conversion'


export type PricingResult = 
    | { ok: true, batchPrice: number, servingPrice: number }
    | { ok: false, error: string }

export function priceRecipe(
    recipe: Recipe,
    pantry: Ingredient[],
    hourlyWage: number | null,
    monthlyOverhead: number | null,
    monthlyHoursWorked: number | null

): PricingResult {
    
    if (hourlyWage === null) {
        return { ok: false, error: 'Hourly wage is required for pricing' }
    }
    if (monthlyOverhead === null) {
        return { ok: false, error: 'Monthly overhead is required for pricing' }
    }
    if (monthlyHoursWorked === null) {
        return { ok: false, error: 'Monthly hours worked is required for pricing' }
    }
    if (monthlyHoursWorked === 0) {
        return { ok: false, error: 'Monthly hours worked cannot be zero' }
    
    }    
    let totalIngredientCost = 0

    for (const recipeIngredient of recipe.ingredients) {
        const ingredientPriceResult = priceIngredient(recipeIngredient, pantry)
        if (!ingredientPriceResult.ok) {
            return { ok: false, error: ingredientPriceResult.error }
        }
        totalIngredientCost += ingredientPriceResult.cost
    }
    const laborCost = hourlyWage * recipe.hoursPerBatch
    const overheadForThisBatch = (monthlyOverhead / monthlyHoursWorked) * recipe.hoursPerBatch
    const totalCost = totalIngredientCost + laborCost + overheadForThisBatch
    const batchPrice = totalCost / (1 - recipe.profitMargin)
    const servingPrice = batchPrice / recipe.servingsPerBatch

    return { ok: true, batchPrice, servingPrice }

}

function priceIngredient(recipeIngredient: RecipeIngredient, pantry: Ingredient[]): { ok: true, cost: number } | { ok: false, error: string } {
    const pantryIngredient = pantry.find(i => i.id === recipeIngredient.ingredientId)
    if (!pantryIngredient) {
        return {ok: false, error: `An ingredient in this recipe is missing from the pantry, please add it to pantry or remove it from the recipe` }
    }

    const conversionResult = convert(pantryIngredient.name, 
        recipeIngredient.quantity, 
        recipeIngredient.unit,
        pantryIngredient.quantity, 
        pantryIngredient.unit)

    if (conversionResult === null) {
        return {ok: false, 
            error: `${pantryIngredient.name} is in your pantry as ${pantryIngredient.unit}, but recipe calls for  ${recipeIngredient.unit}.  These can't be converted automatically - please use matching units on both sides.`
        }
    }

    const cost = (conversionResult.recipe_g / conversionResult.pantry_g) * pantryIngredient.cost
        return { ok: true, cost }

}

