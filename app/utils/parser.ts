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

const unitAbbreviations : Record<string, string> = {

    "c": "cup",
    "c.": "cup",
    "tsp": "teaspoon",
    "tsp.":"teaspoon",
    "t": "teaspoon",
    "t.": "teaspoon",
    "tbsp": "tablespoon",
    "tbsp.":"tablespoon",
    "tbs": "tablespoon",
    "tbs.": "tablespoon",
    "tbl": "tablespoon",
    "tbl.":"tablespoon",
    "tblsp": "tablespoon",
    "tblsp.": "tablespoon",
    "ml": "milliliter",
    "ml.": "milliliter",
    "l": "liter",
    "l.":"liter",
    "gal": "gallon",
    "gal.": "gallon",
    "oz": "ounce",
    "oz.": "ounce",
    "lb": "pound",
    "lb.": "pound",
    "lbs": "pound",
    "lbs.": "pound",
    "g": "gram",
    "g.": "gram",
    "kg": "kilogram",
    "kg.": "kilogram",
    "ea": "each",
    "ea.": "each"
}

const nonMeasurableUnits = [
    'pinch', 
    'pinches', 
    'dash', 
    'dashes', 
    'handful', 
    'smidgen'
]

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
    if (unitWords.startsWith('(')){
        return {verdict:'refused', unit: null, quantity: null,
            nameGuess: null, warnings: [], reason: 'parenthesis found, deferred'
        }
    }
    if (nonMeasurableUnits.includes(unitWords)) {
        return {verdict: 'refused', unit: null, quantity:null,
            nameGuess: null, warnings: [], reason:`non-measurable unit: ${unitWords}`
        }
    }

    let unit = unitAbbreviations[unitWords] ?? unitWords
    if(!units.includes(unit)) {
        unit = unit.endsWith('s') ? unit.slice(0, -1) : unit
        if (!units.includes(unit)) {
        return {verdict: 'warning', unit: 'each', quantity: quantity, 
            nameGuess: words.slice(1).filter(word=> word !=='of').join(' '), warnings: ['no unit specified']}
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

