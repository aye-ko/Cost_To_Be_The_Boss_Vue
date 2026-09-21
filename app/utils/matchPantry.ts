import { type Ingredient } from '~/stores/pantry'

export function matchPantry(nameGuess: string,
    pantry:Ingredient[]): number | null{
    const cleaned = nameGuess.toLowerCase().trim()
    const match = pantry.find(ingredient =>
        ingredient.name.toLowerCase().trim() === cleaned
    )
    return match?.id ?? null
    }
    

