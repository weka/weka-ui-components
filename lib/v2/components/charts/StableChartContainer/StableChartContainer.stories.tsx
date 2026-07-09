import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { StableChartContainer } from './StableChartContainer'

const meta: Meta<typeof StableChartContainer> = {
  title: 'v2/Charts/StableChartContainer',
  component: StableChartContainer
}

export default meta
type Story = StoryObj<typeof StableChartContainer>

const resizableParentStyle: CSSProperties = {
  width: '400px',
  height: '200px',
  resize: 'both',
  overflow: 'auto',
  border: '1px dashed var(--gray-600-400)',
  padding: '8px'
}

const measuredChildStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)'
}

function MeasuredChild({
  width,
  height
}: Readonly<{ width?: number; height?: number }>) {
  return (
    <div style={measuredChildStyle}>
      {`Injected size: ${Math.round(width ?? 0)} x ${Math.round(height ?? 0)}`}
    </div>
  )
}

export const Interactive: Story = {
  render: () => (
    <div style={resizableParentStyle}>
      <StableChartContainer>
        <MeasuredChild />
      </StableChartContainer>
    </div>
  )
}
