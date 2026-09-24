import { type Recipe, type RecipeIngredient } from '~/stores/recipes'

export function scaleRecipe(customers: number, recipe : Recipe): { batches: number, ingredients: RecipeIngredient[]}
    {
        const batches = Math.ceil(customers / recipe.servingsPerBatch)
        const ingredients = recipe.ingredients.map(row =>({ ...row, quantity:row.quantity * batches}))
        return { batches, ingredients }
    }
