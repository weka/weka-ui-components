import type { CSSProperties } from 'react'
import { useCallback, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { EMPTY_STRING, type Severity } from '../../../utils/consts'
import { Checkbox } from '../../CheckBox'
import { SeverityChip } from '../../SeverityChip'

import type { SelectOption } from './Select'
import { Select } from './Select'

const CONTAINER_STYLE: CSSProperties = {
  width: '440px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  color: 'var(--text-primary)'
}

const HELP_STYLE: CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-secondary)',
  marginTop: '-16px'
}

const OPTION_ROW_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%'
}

const REGIONS: SelectOption[] = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'eu-central-1', label: 'EU (Frankfurt)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' }
]

const SEVERITIES: SelectOption[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' }
]

function renderSeverityChip(option: SelectOption, onRemove: () => void) {
  return (
    <SeverityChip
      closable
      onClose={onRemove}
      severity={option.value as Severity}
    />
  )
}

const ANY_VALUE = 'any'

const SEVERITIES_WITH_ANY: SelectOption[] = [
  { value: ANY_VALUE, label: 'Any severity' },
  ...SEVERITIES
]

const MANY_OPTIONS: SelectOption[] = Array.from({ length: 24 }, (_, i) => ({
  value: `bucket-${String(i + 1).padStart(2, '0')}`,
  label: `s3-bucket-${String(i + 1).padStart(2, '0')}`
}))

const ASYNC_DEBOUNCE_MS = 400
const ASYNC_RESULT_LIMIT = 12
const ASYNC_INITIAL_OPTIONS = MANY_OPTIONS.slice(0, ASYNC_RESULT_LIMIT)

const NOOP = () => {}

function SelectDemo() {
  const [region, setRegion] = useState<string | string[]>(EMPTY_STRING)
  const [severities, setSeverities] = useState<string | string[]>([
    'critical',
    'major'
  ])
  const [anyAllowed, setAnyAllowed] = useState<string | string[]>([ANY_VALUE])
  const [bucket, setBucket] = useState<string | string[]>(EMPTY_STRING)

  const [asyncResults, setAsyncResults] =
    useState<SelectOption[]>(ASYNC_INITIAL_OPTIONS)
  const [asyncLoading, setAsyncLoading] = useState(false)
  const [asyncPick, setAsyncPick] = useState<string | string[]>(EMPTY_STRING)

  const renderSeverityOption = useCallback(
    (option: SelectOption) => {
      const current = Array.isArray(severities) ? severities : []
      const isSelected = current.includes(option.value)
      return (
        <div style={OPTION_ROW_STYLE}>
          <Checkbox
            checked={isSelected}
            onChange={NOOP}
          />
          <SeverityChip severity={option.value as Severity} />
        </div>
      )
    },
    [severities]
  )

  const renderAnyOption = useCallback(
    (option: SelectOption) => {
      const current = Array.isArray(anyAllowed) ? anyAllowed : []
      const isSelected = current.includes(option.value)
      if (option.value === ANY_VALUE) {
        return (
          <div style={OPTION_ROW_STYLE}>
            <Checkbox
              checked={isSelected}
              onChange={NOOP}
            />
            <span>{option.label}</span>
          </div>
        )
      }
      return (
        <div style={OPTION_ROW_STYLE}>
          <Checkbox
            checked={isSelected}
            onChange={NOOP}
          />
          <SeverityChip severity={option.value as Severity} />
        </div>
      )
    },
    [anyAllowed]
  )

  const handleAsyncSearch = useCallback((query: string) => {
    setAsyncLoading(true)
    setTimeout(() => {
      const filtered = MANY_OPTIONS.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      ).slice(0, ASYNC_RESULT_LIMIT)
      setAsyncResults(filtered)
      setAsyncLoading(false)
    }, ASYNC_DEBOUNCE_MS)
  }, [])

  return (
    <div style={CONTAINER_STYLE}>
      <Select
        label='Region (single)'
        onChange={setRegion}
        options={REGIONS}
        placeholder='Choose a region'
        required
        value={region}
      />
      <Select
        label='Severities (multi, custom chip + option)'
        multiple
        onChange={setSeverities}
        options={SEVERITIES}
        placeholder='Pick severities'
        renderChip={renderSeverityChip}
        renderOption={renderSeverityOption}
        value={severities}
      />
      <Select
        anyValue={ANY_VALUE}
        label='Severities (multi, with “Any” option)'
        multiple
        onChange={setAnyAllowed}
        options={SEVERITIES_WITH_ANY}
        renderChip={renderSeverityChip}
        renderOption={renderAnyOption}
        value={anyAllowed}
      />
      <div style={HELP_STYLE}>
        Try selecting items, then “Any” — others get cleared. Deselect everything
        — “Any” auto-selects. That’s the difference from the row above.
      </div>
      <Select
        label='Bucket (searchable)'
        onChange={setBucket}
        options={MANY_OPTIONS}
        placeholder='Search buckets…'
        value={bucket}
      />
      <Select
        isLoading={asyncLoading}
        label='Async search (typed)'
        onChange={setAsyncPick}
        onSearch={handleAsyncSearch}
        options={asyncResults}
        placeholder='Type to filter via onSearch…'
        value={asyncPick}
      />
      <div style={HELP_STYLE}>
        Typing fires <code>onSearch</code>; results refresh after a 400ms debounce.
      </div>
      <Select
        disabled
        label='Disabled'
        onChange={() => {}}
        options={REGIONS}
        value='us-east-1'
      />
    </div>
  )
}

const meta: Meta<typeof SelectDemo> = {
  title: 'V2/Inputs/Select',
  component: SelectDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}
