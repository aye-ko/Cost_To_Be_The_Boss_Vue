import { describe, expect, it } from 'vitest';
import { rankIngredients } from './rankIngredients';
import densities from '~/data/densities.json';

describe('rankIngredients', () => {
    it('ranks whole egg above yolk powder for "Egg"', () => {
        const result = rankIngredients('Egg', densities);
        const top = result[0];
        if (!top) {
            throw new Error('result was empty');
        }
        expect(result.length).toBeGreaterThan(0);
        expect(top.name).toBe('Egg, chicken, boiled/poached');
    })

    it('ranks table salt above other salts for "Salt"', () => {
        const result = rankIngredients('Salt', densities);
        const top = result[0];
        if (!top) {
            throw new Error('result was empty');
        }
        expect(result.length).toBeGreaterThan(0);
        expect(top.name).toBe('Salt, table');
    })

    it('ranks whole milk above other milks for "Milk"', () => {
        const result = rankIngredients('Milk', densities);
        const top = result[0];
        if (!top) {
            throw new Error('result was empty');
        }
        expect(result.length).toBeGreaterThan(0);
        expect(top.name).toBe('Milk, cow, whole');
    })

    it('ranks white flour above other flours for "Flour"', () => {
        const result = rankIngredients('Flour', densities);
        const top = result[0];
        if (!top) {
            throw new Error('result was empty');
        }
        expect(result.length).toBeGreaterThan(0);
        expect(top.name).toBe('Wheat, flour, white');
    })
    
});