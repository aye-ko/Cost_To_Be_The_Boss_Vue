import densities from '~/data/densities.json'
import overrides from '~/data/overrides.json'

export function rankIngredients(query: string, densityList: { name: string, density: number }[]): { name: string, density: number }[] {
    
    const overrideMap = overrides as Record<string, string>
    const targetName = overrideMap[query.toLowerCase()]

    if (!targetName) {
        return densityList
    }

    const matchedIngredient = densityList.filter(item => item.name === targetName)
    const rest = densityList.filter(item => item.name !== targetName)

    return [...matchedIngredient, ...rest]
}
