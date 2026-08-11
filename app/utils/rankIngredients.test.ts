import { describe, expect, it } from 'vitest';
import { rankIngredients } from './rankIngredients';
import densities from '~/data/densities.json';

describe('rankIngredients', () => {
    it('ranks whole egg above yolk poweder for "Egg"', () => {
        const result = rankIngredients('Egg', densities);
        expect(result[0].name).toBe('Egg, chicken, boiled/poached');
    })
});