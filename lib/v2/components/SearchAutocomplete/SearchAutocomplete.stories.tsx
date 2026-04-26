import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING } from '../../utils/consts'

import type { SearchOption } from './SearchAutocomplete'
import { SearchAutocomplete } from './SearchAutocomplete'

const CONTAINER_STYLE = {
  padding: '24px',
  minHeight: '500px',
  maxWidth: '420px'
}
const STATUS_TEXT_STYLE = { fontSize: '12px', marginTop: '12px' }

const ALL_OPTIONS: SearchOption[] = [
  { id: '1', label: 'Apple', sublabel: 'Red fruit' },
  { id: '2', label: 'Apricot', sublabel: 'Orange fruit' },
  { id: '3', label: 'Avocado', sublabel: 'Green fruit' },
  { id: '4', label: 'Banana', sublabel: 'Yellow fruit' },
  { id: '5', label: 'Blueberry', sublabel: 'Blue fruit' },
  { id: '6', label: 'Carrot', sublabel: 'Vegetable' },
  { id: '7', label: 'Cherry', sublabel: 'Red fruit' },
  { id: '8', label: 'Date', sublabel: 'Brown fruit' },
  { id: '9', label: 'Eggplant', sublabel: 'Vegetable' }
]

interface DemoProps {
  showAllOnFocus?: boolean
  isLoading?: boolean
  error?: string | null
}

function SearchAutocompleteDemo({
  showAllOnFocus = false,
  isLoading = false,
  error = null
}: Readonly<DemoProps>) {
  const [query, setQuery] = useState(EMPTY_STRING)
  const [selected, setSelected] = useState<SearchOption | null>(null)

  const filteredOptions = useMemo(() => {
    if (!query.trim()) {
      return showAllOnFocus ? ALL_OPTIONS : []
    }
    return ALL_OPTIONS.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, showAllOnFocus])

  return (
    <div style={CONTAINER_STYLE}>
      <SearchAutocomplete
        error={error}
        highlightMatches
        isLoading={isLoading}
        onSearch={setQuery}
        onSelect={setSelected}
        options={filteredOptions}
        showAllOnFocus={showAllOnFocus}
        value={query}
        onClear={() => {
          setQuery(EMPTY_STRING)
          setSelected(null)
        }}
      />
      <p style={STATUS_TEXT_STYLE}>
        Selected: {selected ? selected.label : '(none)'}
      </p>
    </div>
  )
}

const meta: Meta<typeof SearchAutocompleteDemo> = {
  title: 'v2/SearchAutocomplete',
  component: SearchAutocompleteDemo,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SearchAutocompleteDemo>

export const Default: Story = {
  args: {}
}

export const ShowAllOnFocus: Story = {
  args: {
    showAllOnFocus: true
  }
}

export const Loading: Story = {
  args: {
    isLoading: true
  }
}

export const WithError: Story = {
  args: {
    error: 'Failed to load search results'
  }
}
