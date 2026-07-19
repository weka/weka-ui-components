import type { Meta, StoryObj } from '@storybook/react'
import type { CSSProperties } from 'react'

import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'v2/Skeleton',
  component: Skeleton,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Skeleton>

const COLUMN_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: 240
}

const ROW_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12
}

export const Shapes: Story = {
  render: () => (
    <div style={COLUMN_STYLE}>
      <div style={ROW_STYLE}>
        <Skeleton
          borderRadius='50%'
          height={28}
          width={28}
        />
        <Skeleton
          height={20}
          width={130}
        />
      </div>
      <Skeleton
        height={14}
        width='100%'
      />
      <Skeleton
        height={40}
        width='100%'
      />
    </div>
  )
}
