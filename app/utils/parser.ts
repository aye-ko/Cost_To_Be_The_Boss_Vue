import { units } from '~/utils/units'

export interface ParseResult {

    verdict:'parsed' | 'warning' | 'refused'
    unit: string | null
    nameGuess: string | null
    quantity: number | null 
    warnings: string[]
    reason?: string

}

export function parseIngredientLine(line: string): ParseResult {

    const cleanedLine = line.toLowerCase()
    const words = cleanedLine.split(' ')
    const quantity = Number(words[0])
    if(Number.isNaN(quantity)) {
        return {verdict: 'refused', unit: null, quantity: null, 
            nameGuess: null, warnings: [], reason: 'no quantity found'}
    }

    if (words.length < 3) {
        return {verdict: 'refused', unit: null, quantity: null, 
            nameGuess: null, warnings: [], reason: 'not enough words'}
    }

    const unitWords = words[1]
    if (unitWords === undefined){
        return {verdict: 'refused', unit: null, quantity: null, 
            nameGuess: null, warnings: [], reason: 'no unit found'}
    }        
    let unit = unitWords


    if(!units.includes(unit)) {
        unit = unit.endsWith('s') ? unit.slice(0, -1) : unit
        if (!units.includes(unit)) {
        return {verdict: 'refused', unit: null, quantity: null, 
            nameGuess: null, warnings: [], reason: `unknown unit: ${unitWords}`}
        } 
    }

    const nameGuess = words.slice(2).filter(word => word !== 'of').join(' ')

    return {
        verdict: 'parsed',
        unit: unit,
        quantity: quantity,
        nameGuess: nameGuess,
        warnings: [],
        
    }

}

