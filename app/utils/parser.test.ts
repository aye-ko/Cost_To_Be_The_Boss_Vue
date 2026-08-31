import { describe, it, expect } from 'vitest'
import {parseIngredientLine} from './parser'

describe('parseIngredientLine', () => {
    it('parse a simple name-unit-quantity line', () => {
        const result = parseIngredientLine('2 cups of onion powder')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('onion powder')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('cup')
    })

    it('raise a warning for 2 eggs', () => {
        const result = parseIngredientLine('2 eggs')
        expect(result.verdict).toBe('warning')
        expect(result.nameGuess).toBe('eggs')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('each')
        expect(result.warnings).toContain('no unit specified')
    })
    it('parses a fraction glyph quantity', () => {
        const result = parseIngredientLine('1 ½ teaspoons creole seasoning')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('creole seasoning')
        expect(result.quantity).toBe(1.5)
        expect(result.unit).toBe('teaspoon')
    })
    it('parse a fraction with a slash', () =>{
        const result = parseIngredientLine('1 1/2 teaspoons creole seasoning')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('creole seasoning')
        expect(result.quantity).toBe(1.5)
        expect(result.unit).toBe('teaspoon')
    })
    it('parses abbreviations for tbs and unit tablespoon', () => {
        const result = parseIngredientLine('1 tbs creole seasoning')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('creole seasoning')
        expect(result.quantity).toBe(1)
        expect(result.unit).toBe('tablespoon')
    })
    it('parses abbreviations for tbs. and fraction with a slash1 1/2', () => {
        const result = parseIngredientLine('1 1/2 tbs. creole seasoning')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('creole seasoning')
        expect(result.quantity).toBe(1.5)
        expect(result.unit).toBe('tablespoon')
    })
    




    it('parses 1/4 cup olive oil', () => {
        const result = parseIngredientLine('1/4 cup olive oil')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('olive oil')
        expect(result.quantity).toBe(0.25)
        expect(result.unit).toBe('cup')
    })

    it('parses 2 yellow onion, chopped', () => {
        const result = parseIngredientLine('2 yellow onion, chopped')
        expect(result.verdict).toBe('warning')
        expect(result.warnings).toContain("no unit specified")
        expect(result.nameGuess).toBe('yellow onion, chopped')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('each')
    })

    it('parses 2 red bell pepper, chopped', () => {
        const result = parseIngredientLine('2 red bell pepper, chopped')
        expect(result.verdict).toBe('warning')
        expect(result.warnings).toContain("no unit specified")
        expect(result.nameGuess).toBe('red bell pepper, chopped')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('each')
    })

    it('parses 2 Anaheim chile pepper, chopped', () => {
        const result = parseIngredientLine('2 Anaheim chile pepper, chopped')
        expect(result.verdict).toBe('warning')
        expect(result.warnings).toContain("no unit specified")
        expect(result.nameGuess).toBe('anaheim chile pepper, chopped')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('each')
    })

    it('parses 4 red jalapeño chile peppers, chopped', () => {
        const result = parseIngredientLine('4 red jalapeño chile peppers, chopped')
        expect(result.verdict).toBe('warning')
        expect(result.warnings).toContain("no unit specified")
        expect(result.nameGuess).toBe('red jalapeño chile peppers, chopped')
        expect(result.quantity).toBe(4)
        expect(result.unit).toBe('each')
    })

    it('parses 8 garlic cloves, minced', () => {
        const result = parseIngredientLine('8 garlic cloves, minced')
        expect(result.verdict).toBe('warning')
        expect(result.warnings).toContain("no unit specified")
        expect(result.nameGuess).toBe('garlic cloves, minced')
        expect(result.quantity).toBe(8)
        expect(result.unit).toBe('each')
    })

    it('parses 5 pounds lean ground beef', () => {
        const result = parseIngredientLine('5 pounds lean ground beef')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('lean ground beef')
        expect(result.quantity).toBe(5)
        expect(result.unit).toBe('pound')
    })

    it('parses ½ cup Worcestershire sauce', () => {
        const result = parseIngredientLine('½ cup Worcestershire sauce')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('worcestershire sauce')
        expect(result.quantity).toBe(0.5)
        expect(result.unit).toBe('cup')
    })

    it('parses 2 pinches garlic powder, or to taste', () => {
        const result = parseIngredientLine('2 pinches garlic powder, or to taste')
        expect(result.verdict).toBe('refused')
        expect(result.reason).toContain('non-measurable')
    })

    it('parses 4 beef bouillon cubes', () => {
        const result = parseIngredientLine('4 beef bouillon cubes')
        expect(result.verdict).toBe('warning')
        expect(result.warnings).toContain("no unit specified")
        expect(result.nameGuess).toBe('beef bouillon cubes')
        expect(result.quantity).toBe(4)
        expect(result.unit).toBe('each')
    })

    it('parses 2 (12 fluid ounce) can or bottle light beer (such as Coors)', () => {
        const result = parseIngredientLine('2 (12 fluid ounce) can or bottle light beer (such as Coors)')
        expect(result.verdict).toBe('refused')
    })

    it('parses 2 (28 ounce) can crushed San Marzano tomatoes', () => {
        const result = parseIngredientLine('2 (28 ounce) can crushed San Marzano tomatoes')
        expect(result.verdict).toBe('refused')
    })

    it('parses 2 (14.5 ounce) can fire-roasted diced tomatoes', () => {
        const result = parseIngredientLine('2 (14.5 ounce) can fire-roasted diced tomatoes')
        expect(result.verdict).toBe('refused')
    })

    it('parses 2 (12 ounce) can tomato paste', () => {
        const result = parseIngredientLine('2 (12 ounce) can tomato paste')
        expect(result.verdict).toBe('refused')
    })

    it('parses 1 cup white wine', () => {
        const result = parseIngredientLine('1 cup white wine')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('white wine')
        expect(result.quantity).toBe(1)
        expect(result.unit).toBe('cup')
    })

    it('parses 4 tablespoons chili powder', () => {
        const result = parseIngredientLine('4 tablespoons chili powder')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('chili powder')
        expect(result.quantity).toBe(4)
        expect(result.unit).toBe('tablespoon')
    })

    it('parses 4 tablespoons ground cumin', () => {
        const result = parseIngredientLine('4 tablespoons ground cumin')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('ground cumin')
        expect(result.quantity).toBe(4)
        expect(result.unit).toBe('tablespoon')
    })

    it('parses 2 tablespoons brown sugar', () => {
        const result = parseIngredientLine('2 tablespoons brown sugar')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('brown sugar')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('tablespoon')
    })

    it('parses 2 tablespoons chipotle pepper sauce', () => {
        const result = parseIngredientLine('2 tablespoons chipotle pepper sauce')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('chipotle pepper sauce')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('tablespoon')
    })

    it('parses 5 teaspoons dried basil', () => {
        const result = parseIngredientLine('5 teaspoons dried basil')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('dried basil')
        expect(result.quantity).toBe(5)
        expect(result.unit).toBe('teaspoon')
    })

    it('parses 1 tablespoon smoked paprika', () => {
        const result = parseIngredientLine('1 tablespoon smoked paprika')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('smoked paprika')
        expect(result.quantity).toBe(1)
        expect(result.unit).toBe('tablespoon')
    })

    it('parses 2 teaspoons salt', () => {
        const result = parseIngredientLine('2 teaspoons salt')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('salt')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('teaspoon')
    })

    it('parses 1 teaspoon dried oregano', () => {
        const result = parseIngredientLine('1 teaspoon dried oregano')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('dried oregano')
        expect(result.quantity).toBe(1)
        expect(result.unit).toBe('teaspoon')
    })

    it('parses 1 teaspoon ground black pepper', () => {
        const result = parseIngredientLine('1 teaspoon ground black pepper')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('ground black pepper')
        expect(result.quantity).toBe(1)
        expect(result.unit).toBe('teaspoon')
    })

    it("parses 4 (16 ounce) cans dark red kidney beans (such as Bush's)", () => {
        const result = parseIngredientLine("4 (16 ounce) cans dark red kidney beans (such as Bush's)")
        expect(result.verdict).toBe('refused')
    })

    it('parses 2 cups sour cream', () => {
        const result = parseIngredientLine('2 cups sour cream')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('sour cream')
        expect(result.quantity).toBe(2)
        expect(result.unit).toBe('cup')
    })

    it('parses 6 tablespoons chopped fresh cilantro', () => {
        const result = parseIngredientLine('6 tablespoons chopped fresh cilantro')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('chopped fresh cilantro')
        expect(result.quantity).toBe(6)
        expect(result.unit).toBe('tablespoon')
    })

    it('parses 1 teaspoon ground cumin', () => {
        const result = parseIngredientLine('1 teaspoon ground cumin')
        expect(result.verdict).toBe('parsed')
        expect(result.nameGuess).toBe('ground cumin')
        expect(result.quantity).toBe(1)
        expect(result.unit).toBe('teaspoon')
    })
})

