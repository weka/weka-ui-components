import { describe, expect, it } from 'vitest'

import {
  moveColumnId,
  normalizeColumnOrder,
  splitColumnIds
} from './columnOrder'

const IDS = ['name', 'a', 'b', 'c', 'actions']
const LOCKS = { lockedStart: 1, lockedEnd: 1 }

describe('splitColumnIds', () => {
  it('splits ids into locked start, movable and locked end ranges', () => {
    expect(splitColumnIds(IDS, LOCKS)).toEqual({
      start: ['name'],
      movable: ['a', 'b', 'c'],
      end: ['actions']
    })
  })

  it('leaves nothing movable when the locks overlap', () => {
    expect(
      splitColumnIds(['x', 'y'], { lockedStart: 2, lockedEnd: 2 }).movable
    ).toEqual([])
  })
})

describe('normalizeColumnOrder', () => {
  it('returns definition order when nothing is saved', () => {
    expect(normalizeColumnOrder(IDS, [], LOCKS)).toEqual(IDS)
  })

  it('keeps the saved order of movable columns and pins locked ones', () => {
    expect(
      normalizeColumnOrder(IDS, ['actions', 'c', 'name', 'a', 'b'], LOCKS)
    ).toEqual(['name', 'c', 'a', 'b', 'actions'])
  })

  it('drops unknown ids and appends columns missing from the saved order', () => {
    expect(normalizeColumnOrder(IDS, ['gone', 'b'], LOCKS)).toEqual([
      'name',
      'b',
      'a',
      'c',
      'actions'
    ])
  })
})

describe('moveColumnId', () => {
  it('moves a column right into the target position', () => {
    expect(moveColumnId(['a', 'b', 'c'], 'a', 'c')).toEqual(['b', 'c', 'a'])
  })

  it('moves a column left into the target position', () => {
    expect(moveColumnId(['a', 'b', 'c'], 'c', 'a')).toEqual(['c', 'a', 'b'])
  })

  it('returns the same order for an unknown id', () => {
    const order = ['a', 'b']
    expect(moveColumnId(order, 'a', 'z')).toBe(order)
  })
})
