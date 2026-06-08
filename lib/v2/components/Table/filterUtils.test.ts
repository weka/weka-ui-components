import { describe, expect, it } from 'vitest'

import { EMPTY_STRING, FILTER_TYPES } from '#v2/utils/consts'

import {
  createFilterConfigByType,
  findColumn,
  getColumnId,
  getColumnLabel,
  isFilterValueEmpty,
  normalizeFilterOptions
} from './filterUtils'

describe('getColumnId', () => {
  it('prefers id, then accessorKey, then accessorFn.name', () => {
    expect(getColumnId({ id: 'a', accessorKey: 'b' })).toBe('a')
    expect(getColumnId({ accessorKey: 'b' })).toBe('b')
    expect(getColumnId({ accessorFn: { name: 'c' } })).toBe('c')
  })
})

describe('getColumnLabel', () => {
  it('capitalizes a string header', () => {
    expect(getColumnLabel({ header: 'name' }, 'fallback')).toBe('Name')
  })

  it('falls back when header is not a string', () => {
    expect(getColumnLabel({ header: () => 'x' }, 'region')).toBe('Region')
  })
})

describe('isFilterValueEmpty', () => {
  it('treats empty primitives and arrays as empty', () => {
    expect(isFilterValueEmpty(EMPTY_STRING)).toBe(true)
    expect(isFilterValueEmpty(undefined)).toBe(true)
    expect(isFilterValueEmpty([])).toBe(true)
  })

  it('treats populated primitives and arrays as non-empty', () => {
    expect(isFilterValueEmpty('text')).toBe(false)
    expect(isFilterValueEmpty(['a'])).toBe(false)
  })

  it('detects empty and populated date ranges', () => {
    expect(isFilterValueEmpty({ from: undefined, to: undefined })).toBe(true)
    expect(isFilterValueEmpty({ from: '2026-01-01', to: undefined })).toBe(
      false
    )
  })

  it('detects empty and populated numeric ranges', () => {
    expect(isFilterValueEmpty({ min: null, max: null })).toBe(true)
    expect(isFilterValueEmpty({ min: 1, max: null })).toBe(false)
  })

  it('treats unrecognized objects (custom filters) as non-empty', () => {
    expect(isFilterValueEmpty({ mode: 'used', used: {}, total: {} })).toBe(
      false
    )
  })
})

describe('normalizeFilterOptions', () => {
  it('converts string options and passes through objects', () => {
    expect(normalizeFilterOptions(['a', { value: 'b', label: 'B' }])).toEqual([
      { value: 'a', label: 'a' },
      { value: 'b', label: 'B' }
    ])
  })

  it('reads fixedOptions form', () => {
    expect(normalizeFilterOptions({ fixedOptions: ['x'] })).toEqual([
      { value: 'x', label: 'x' }
    ])
  })
})

describe('findColumn', () => {
  it('matches by id then accessorKey', () => {
    const columns = [{ id: 'a' }, { accessorKey: 'b' }]
    expect(findColumn(columns, 'a')).toBe(columns[0])
    expect(findColumn(columns, 'b')).toBe(columns[1])
  })
})

describe('createFilterConfigByType', () => {
  it('builds a multiselect config from meta', () => {
    const config = createFilterConfigByType('region', {
      type: FILTER_TYPES.MULTISELECT,
      options: ['us-east-1']
    })
    expect(config.type).toBe(FILTER_TYPES.MULTISELECT)
    expect(config.options).toEqual([{ value: 'us-east-1', label: 'us-east-1' }])
  })

  it('builds a capacity-range config carrying modeLabels', () => {
    const config = createFilterConfigByType('cap', {
      type: FILTER_TYPES.CAPACITY_RANGE,
      modeLabels: { used: 'Used', total: 'Total' }
    })
    expect(config.type).toBe(FILTER_TYPES.CAPACITY_RANGE)
    expect(config.modeLabels).toEqual({ used: 'Used', total: 'Total' })
  })

  it('falls back to a text filter for unknown types', () => {
    expect(createFilterConfigByType('x', { type: 'mystery' }).type).toBe(
      FILTER_TYPES.TEXT
    )
  })
})
