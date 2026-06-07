import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { EMPTY_STRING, NOOP } from '#v2/utils/consts'

import { FilterSearch } from './FilterSearch'

const meta: Meta<typeof FilterSearch> = {
  title: 'v2/Table/filters/FilterSearch'
}

export default meta
type Story = StoryObj<typeof FilterSearch>

const TEXT_PRIMARY = 'var(--text-primary)'

const CONTAINER_STYLE = {
  width: 280,
  padding: 16,
  background: 'var(--bg-secondary)'
}

const RESULTS_STYLE = {
  marginTop: 8,
  color: TEXT_PRIMARY,
  fontSize: 14
}

const ITEM_STYLE = {
  display: 'block',
  width: '100%',
  padding: '6px 4px',
  border: 'none',
  background: 'none',
  font: 'inherit',
  color: TEXT_PRIMARY,
  textAlign: 'left' as const,
  cursor: 'pointer'
}

const SELECTED_STYLE = {
  marginTop: 8,
  color: TEXT_PRIMARY,
  fontSize: 14,
  fontWeight: 600
}

const HINT_STYLE = {
  padding: '6px 4px',
  color: 'var(--text-secondary)',
  fontSize: 12
}

const BUCKETS = [
  'analytics-prod',
  'analytics-staging',
  'backups-daily',
  'backups-weekly',
  'logs-archive',
  'logs-ingest',
  'media-uploads',
  'ml-training-data',
  'metrics-rollup',
  'user-exports'
]

function FilterSearchDemo() {
  const [query, setQuery] = useState(EMPTY_STRING)
  const [showList, setShowList] = useState(false)
  const [selected, setSelected] = useState(EMPTY_STRING)

  const matches = BUCKETS.filter((bucket) =>
    bucket.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (bucket: string) => {
    setSelected(bucket)
    setShowList(false)
  }

  const renderResults = () => {
    if (matches.length === 0) {
      return <div style={HINT_STYLE}>No matches for “{query}”</div>
    }
    const caption = showList
      ? `Results for “${query}”`
      : `All ${BUCKETS.length} buckets — type to filter`
    return (
      <>
        <div style={HINT_STYLE}>{caption}</div>
        {matches.map((bucket) => (
          <button
            key={bucket}
            onClick={() => handleSelect(bucket)}
            style={ITEM_STYLE}
            type='button'
          >
            {bucket}
          </button>
        ))}
      </>
    )
  }

  return (
    <div style={CONTAINER_STYLE}>
      <FilterSearch
        onSearch={setQuery}
        setSelectedOptionIndex={NOOP}
        setShowOptionsList={setShowList}
        onClear={() => {
          setQuery(EMPTY_STRING)
          setShowList(false)
        }}
      />
      <div style={RESULTS_STYLE}>{renderResults()}</div>
      {selected ? <div style={SELECTED_STYLE}>Selected: {selected}</div> : null}
    </div>
  )
}

export const Interactive: Story = {
  render: () => <FilterSearchDemo />
}
