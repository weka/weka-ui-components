import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { useState } from 'react'

import { NOP } from '#consts'

import { NumberInput } from './NumberInput'

const CONTAINER_STYLE: CSSProperties = {
  width: '280px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  color: 'var(--text-primary)'
}

const QUANTITY_INITIAL = '1'
const PORT_INITIAL = '8080'
const PERCENT_INITIAL = '50'
const STEP_FIVE = 5
const MIN_ZERO = 0
const MAX_HUNDRED = 100
const PORT_MIN = 1
const PORT_MAX = 65535

function NumberInputDemo() {
  const [quantity, setQuantity] = useState(QUANTITY_INITIAL)
  const [port, setPort] = useState(PORT_INITIAL)
  const [percent, setPercent] = useState(PERCENT_INITIAL)
  return (
    <div style={CONTAINER_STYLE}>
      <NumberInput
        id='quantity'
        label='Quantity'
        max={MAX_HUNDRED}
        min={MIN_ZERO}
        onChange={setQuantity}
        required
        showArrows
        value={quantity}
      />
      <NumberInput
        id='port'
        label='Port'
        max={PORT_MAX}
        min={PORT_MIN}
        onChange={setPort}
        value={port}
      />
      <NumberInput
        id='percent'
        label='Percent (step 5)'
        max={MAX_HUNDRED}
        min={MIN_ZERO}
        onChange={setPercent}
        showArrows
        step={STEP_FIVE}
        value={percent}
      />
      <NumberInput
        disabled
        id='disabled'
        label='Disabled'
        onChange={NOP}
        showArrows
        value='42'
      />
    </div>
  )
}

const meta: Meta<typeof NumberInputDemo> = {
  title: 'V2/Inputs/NumberInput',
  component: NumberInputDemo,
  parameters: { layout: 'centered' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {}
