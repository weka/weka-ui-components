import type { Meta, StoryObj } from '@storybook/react'

import { WidgetCard } from './WidgetCard'

const meta: Meta<typeof WidgetCard> = {
  title: 'v2/WidgetCard',
  component: WidgetCard,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof WidgetCard>

interface DemoData {
  message: string
}

const demoData: DemoData = { message: 'Widget content rendered from data' }

export const WithData: Story = {
  render: () => (
    <WidgetCard<DemoData>
      data={demoData}
      title='Capacity'
      tooltip='Cluster capacity breakdown'
    >
      {(data) => <p>{data.message}</p>}
    </WidgetCard>
  )
}

export const Loading: Story = {
  render: () => (
    <WidgetCard<DemoData>
      data={null}
      title='Capacity'
      tooltip='Cluster capacity breakdown'
    >
      {(data) => <p>{data.message}</p>}
    </WidgetCard>
  )
}
