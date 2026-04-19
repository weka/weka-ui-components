import type { Meta, StoryObj } from '@storybook/react'

import { LoadingState } from './LoadingState'

const meta: Meta<typeof LoadingState> = {
  title: 'v2/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['loading', 'error', 'noData']
    },
    message: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof LoadingState>

export const Loading: Story = {
  args: {
    type: 'loading'
  }
}

export const LoadingWithCustomMessage: Story = {
  args: {
    type: 'loading',
    message: 'Fetching data from server...'
  }
}

export const Error: Story = {
  args: {
    type: 'error'
  }
}

export const ErrorWithCustomMessage: Story = {
  args: {
    type: 'error',
    message: 'Failed to connect to the server'
  }
}

export const NoData: Story = {
  args: {
    type: 'noData'
  }
}

export const NoDataWithCustomMessage: Story = {
  args: {
    type: 'noData',
    message: 'No results found for your search'
  }
}

export const WithChildren: Story = {
  render: () => (
    <LoadingState
      message='Something went wrong'
      type='error'
    >
      <button
        onClick={() => alert('Retry clicked')}
        style={{ marginTop: '12px', padding: '8px 16px', cursor: 'pointer' }}
        type='button'
      >
        Retry
      </button>
    </LoadingState>
  )
}
