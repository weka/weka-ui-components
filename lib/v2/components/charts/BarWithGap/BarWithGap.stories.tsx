import type { Meta, StoryObj } from '@storybook/react'

import { BarWithGap } from './BarWithGap'

const meta: Meta<typeof BarWithGap> = {
  title: 'v2/Charts/BarWithGap',
  component: BarWithGap
}

export default meta
type Story = StoryObj<typeof BarWithGap>

const BAR_WIDTH = 28
const BAR_GAP = 12
const CHART_HEIGHT = 120
const BARS = [
  { height: 40 },
  { height: 90 },
  { height: 60 },
  { height: 110 },
  { height: 20 }
]

export const RoundedBars: Story = {
  render: () => (
    <svg
      height={CHART_HEIGHT}
      width={BARS.length * (BAR_WIDTH + BAR_GAP)}
    >
      {BARS.map(({ height }, i) => (
        <BarWithGap
          key={height}
          fill='var(--purple-500)'
          height={height}
          width={BAR_WIDTH}
          x={i * (BAR_WIDTH + BAR_GAP)}
          y={CHART_HEIGHT - height}
        />
      ))}
    </svg>
  )
}
