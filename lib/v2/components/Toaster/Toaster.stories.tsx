import type { Meta, StoryObj } from '@storybook/react'

import {
  toastError,
  toastInfo,
  toastSuccess,
  toastWarning
} from '#v2/utils/toast'

import { Button } from '../Button'
import { Toaster } from './Toaster'

const meta: Meta<typeof Toaster> = {
  title: 'v2/Toaster',
  component: Toaster,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Toaster>

const rowStyle = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap' as const
}

export const Interactive: Story = {
  render: () => (
    <>
      <div style={rowStyle}>
        <Button
          onClick={() => toastSuccess('Cluster provisioned successfully')}
        >
          Success
        </Button>
        <Button onClick={() => toastError('Failed to reach the cluster')}>
          Error
        </Button>
        <Button onClick={() => toastWarning('Capacity is running low')}>
          Warning
        </Button>
        <Button onClick={() => toastInfo('A new version is available')}>
          Info
        </Button>
      </div>
      <Toaster />
    </>
  )
}
