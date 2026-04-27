import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { NumInputSpinButton } from './NumInputSpinButton'

const CONTAINER_STYLE = {
  position: 'relative' as const,
  width: '120px',
  height: '32px',
  border: '1px solid var(--border-light)',
  borderRadius: '4px'
}
const VALUE_STYLE = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  fontSize: '14px',
  paddingLeft: '12px',
  paddingRight: '32px'
}

interface DemoProps {
  initialValue?: number
  disabled?: boolean
}

function NumInputSpinButtonDemo({
  initialValue = 0,
  disabled = false
}: Readonly<DemoProps>) {
  const [value, setValue] = useState(initialValue)
  return (
    <div style={CONTAINER_STYLE}>
      <div style={VALUE_STYLE}>{value}</div>
      <NumInputSpinButton
        disabled={disabled}
        onClickDown={() => setValue((v) => v - 1)}
        onClickUp={() => setValue((v) => v + 1)}
      />
    </div>
  )
}

const meta: Meta<typeof NumInputSpinButtonDemo> = {
  title: 'v2/NumInputSpinButton',
  component: NumInputSpinButtonDemo,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof NumInputSpinButtonDemo>

export const Default: Story = {
  args: {
    initialValue: 0
  }
}

export const Disabled: Story = {
  args: {
    initialValue: 5,
    disabled: true
  }
}
