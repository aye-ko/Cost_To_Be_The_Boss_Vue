import densities from '~/data/densities.json'

export function rankIngredients(query: string, densityList: { name: string, density: number }[]): { name: string, density: number }[] {
    const overrides: Record<string, string> = {
        egg: 'Egg, chicken, boiled/poached'
}
    const targetName = overrides[query.toLowerCase()]
    if (!targetName) { return densityList }

    const matchedIngredient = densityList.filter(item => item.name === targetName)
    const rest = densityList.filter(item => item.name !== targetName)

    return [...matchedIngredient, ...rest]
}
