import { describe, expect, it } from 'vitest'

import { buildFreeEntrySuggestions } from './formMultiSelect.utils'

const OPTIONS = ['node-a', 'node-b', 'gateway']

describe('buildFreeEntrySuggestions', () => {
  it('returns nothing for a blank query', () => {
    expect(buildFreeEntrySuggestions(OPTIONS, '   ')).toEqual([])
  })

  it('lists the matching options followed by the typed value', () => {
    expect(buildFreeEntrySuggestions(OPTIONS, 'node')).toEqual([
      'node-a',
      'node-b',
      'node'
    ])
  })

  it('does not repeat a typed value that is already an option', () => {
    expect(buildFreeEntrySuggestions(OPTIONS, 'node-a')).toEqual(['node-a'])
  })

  it('offers only the typed value when nothing matches', () => {
    expect(buildFreeEntrySuggestions(OPTIONS, 'storage')).toEqual(['storage'])
  })
})
