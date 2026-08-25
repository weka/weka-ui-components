import type { Meta, StoryObj } from '@storybook/react'

import { useEffect, useState } from 'react'

import { SyncProgressBar } from './SyncProgressBar'

const ANIMATION_TICK_MS = 500
const ANIMATION_STEP_PERCENT = 5

/** Advances `percent` on an interval so the bar's `width` transition animates, looping back to 0 once full. */
function AnimatedSyncProgressBar() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPercent((previous) =>
        previous >= 100 ? 0 : previous + ANIMATION_STEP_PERCENT
      )
    }, ANIMATION_TICK_MS)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <SyncProgressBar
      caption={`${percent}% · 366 MiB/s`}
      percent={percent}
    />
  )
}

const meta: Meta<typeof SyncProgressBar> = {
  title: 'v2/SyncProgressBar',
  component: SyncProgressBar,
  tags: ['autodocs'],
  argTypes: {
    percent: { control: { type: 'range', min: 0, max: 100, step: 1 } }
  }
}

export default meta
type Story = StoryObj<typeof SyncProgressBar>

export const Default: Story = {
  args: {
    percent: 42
  }
}

export const WithThroughputCaption: Story = {
  args: {
    percent: 42,
    caption: '42% · 366 MiB/s'
  }
}

export const Animated: Story = {
  render: () => <AnimatedSyncProgressBar />
}
