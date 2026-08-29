import { units } from '~/utils/units'

export interface ParseResult {

    verdict:'parsed' | 'warning' | 'refused'
    unit: string | null
    nameGuess: string | null
    quantity: number | null 
    warnings: string[]
    reason?: string

}

const glyphs: Record<string, number> = {
    '¼': 0.25,
    '½': 0.5,
    '¾': 0.75,
    '⅓': 1/3,
    '⅔': 2/3,
    '⅛': 0.125,
    '⅜': 0.375,
    '⅝': 0.625,
    '⅞': 0.875
}
const glyphPattern = new RegExp(`(\\d+)? ?([${Object.keys(glyphs).join('')}])`,'g')
const slashFractionPattern = /(\d+)? ?(\d+)\/(\d+)/g
export function parseIngredientLine(line: string): ParseResult {

    const cleanedLine = line.toLowerCase()
    .replace(glyphPattern,(match, whole, glyph) =>{
        const base = whole ? Number(whole) : 0
        const value = glyphs[glyph]
        if(value === undefined) return match
        return String(base + value)
        })
    .replace(slashFractionPattern,(match, whole, numerator,denominator) => {            const base = whole ? Number(whole) : 0
        if (Number(denominator) === 0) {return match}
        const value = Number(numerator) / Number(denominator)
        return String(base + value )     
    })


    const words = cleanedLine.split(' ')
    const quantity = Number(words[0])
    if(Number.isNaN(quantity)) {
        return {verdict: 'refused', unit: null, quantity: null, 
            nameGuess: null, warnings: [], reason: 'no quantity found'}
    }

    if (words.length === 2) {
        const name = words[1]
        if (name === undefined) {return {verdict: 'refused', unit: null, quantity: null, 
            nameGuess: null, warnings: [], reason: 'no name found'}}
        return {verdict: 'warning', unit: 'each', quantity: quantity, 
            nameGuess: name, warnings: ['no unit specified']}
        
    }

    if (words.length < 2) {
        return {verdict: 'refused', unit: null , quantity: null, 
            nameGuess: null, warnings: [], reason: 'too short to parse. not enough words'}
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

