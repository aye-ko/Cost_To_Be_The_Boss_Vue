import densities from '~/data/densities.json'

const weightTable: Record<string, number> = {
    gram: 1,
    kilogram: 1000,
    ounce: 28.3495,
    pound: 453.592
}
const volumeTable: Record<string, number> = {
    milliliter: 1,
    teaspoon: 4.929,
    tablespoon: 14.787,
    cup: 236.588,
    'fluid ounce': 29.5735,
    liter: 1000,
    gallon: 3785.41
}

function toGrams(qty: number, unit: string, ingredientName: string): number | null {
    if (unit in weightTable) {
        const factor = weightTable[unit]
        if (factor === undefined) return null
        return qty * factor
    }
    
    if (unit in volumeTable) {
        const factor = volumeTable[unit]
        if (factor === undefined) return null
        
        const density = densities.find(d => d.name === ingredientName)?.density
        if (!density) return null
        
        return qty * factor * density
    }
    
    return null
}

export function convert(ingredientName: string, recipeQty: number, recipeUnit:string, pantryQty:number, pantryUnit:string): { recipe_g: number, pantry_g: number } | null {

    if (recipeUnit === pantryUnit) {
        return {recipe_g : recipeQty, pantry_g: pantryQty}
    }

    if ( (recipeUnit === 'each' || pantryUnit === 'each') && recipeUnit !== pantryUnit) {
        return null
    }

    const recipe_g = toGrams(recipeQty, recipeUnit, ingredientName)
    const pantry_g = toGrams(pantryQty, pantryUnit, ingredientName)

    if (recipe_g === null || pantry_g === null) {
        return null
    }

    return {recipe_g, pantry_g}

}