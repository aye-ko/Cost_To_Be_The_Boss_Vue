import { describe, it, expect } from 'vitest'
import { unitKind } from './conversion'

describe('unitKind', () => {
    it('returns "weight" for weight units', () => {
        expect(unitKind('gram')).toBe('weight')
    })

    it('returns "volume" for volume units', () => {
        expect(unitKind('cup')).toBe('volume')
    }) 

    it('returns "count" for each units', () => {
        expect(unitKind('each')).toBe('count')
    })

    it('returns null for empty string', () => {
        expect(unitKind('')).toBeNull()
    })

    it('returns null for unknown units', () => {
        expect(unitKind('unknownUnit')).toBeNull()
    })
})
