import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { NumberRange, type NumRangeFilterType } from './NumberRange'

const meta: Meta<typeof NumberRange> = {
  title: 'v2/Table/filters/NumberRange'
}

export default meta
type Story = StoryObj<typeof NumberRange>

const CONTAINER_STYLE = {
  width: 240,
  padding: 16,
  background: 'var(--bg-secondary)'
}

const VALUE_STYLE = {
  marginTop: 12,
  color: 'var(--text-primary)',
  fontSize: 13
}

function NumberRangeDemo() {
  const [range, setRange] = useState<NumRangeFilterType>({
    min: null,
    max: null
  })

  return (
    <div style={CONTAINER_STYLE}>
      <NumberRange
        initialValues={range}
        onChange={setRange}
      />
      <div style={VALUE_STYLE}>
        min: {String(range.min)} · max: {String(range.max)}
      </div>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <NumberRangeDemo />
}
