import type { Meta, StoryObj } from '@storybook/react'
import type { Severity } from '#v2/utils/consts'

import { useState } from 'react'

import { EMPTY_STRING, SEVERITY_TYPES } from '#v2/utils/consts'

import { SeverityChip } from '../../SeverityChip'
import { FilterOptionRow } from './FilterOptionRow'

const meta: Meta<typeof FilterOptionRow> = {
  title: 'v2/Table/filters/FilterOptionRow'
}

export default meta
type Story = StoryObj<typeof FilterOptionRow>

const CONTAINER_STYLE = {
  width: 320,
  padding: 16,
  background: 'var(--bg-secondary)'
}

const SEARCH_INPUT_STYLE = {
  width: '100%',
  padding: '6px 8px',
  marginBottom: 8,
  boxSizing: 'border-box' as const,
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--gray-550-450)',
  borderRadius: 4
}

const SECTION_LABEL_STYLE = {
  margin: '12px 0 4px',
  color: 'var(--text-secondary)',
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5
}

const REGIONS = ['us-east-1', 'us-west-2', 'eu-central-1', 'ap-southeast-1']

const SEVERITIES: Severity[] = [
  SEVERITY_TYPES.CRITICAL,
  SEVERITY_TYPES.WARNING,
  SEVERITY_TYPES.INFO
]

function FilterOptionRowDemo() {
  const [selected, setSelected] = useState<string[]>(['us-east-1'])
  const [query, setQuery] = useState(EMPTY_STRING)

  const toggle = (option: string) =>
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((value) => value !== option)
        : [...prev, option]
    )

  const visibleRegions = REGIONS.filter((region) =>
    region.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div style={CONTAINER_STYLE}>
      <div style={SECTION_LABEL_STYLE}>Region (text options)</div>
      <input
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Filter regions…'
        style={SEARCH_INPUT_STYLE}
        value={query}
      />
      {visibleRegions.map((region, index) => (
        <FilterOptionRow
          key={region}
          dataOptionIndex={index}
          isSelected={selected.includes(region)}
          label={region}
          onChange={() => toggle(region)}
          searchQuery={query}
          shouldHighlightMatches={Boolean(query)}
          subLabel={region === 'us-east-1' ? 'Primary region' : undefined}
        />
      ))}
      <div style={SECTION_LABEL_STYLE}>Severity (chip options)</div>
      {SEVERITIES.map((severity) => (
        <FilterOptionRow
          key={severity}
          chipElement={<SeverityChip severity={severity} />}
          isSelected={selected.includes(severity)}
          label={severity}
          onChange={() => toggle(severity)}
        />
      ))}
    </div>
  )
}

export const Interactive: Story = {
  render: () => <FilterOptionRowDemo />
}
