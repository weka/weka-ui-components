import type { Meta, StoryObj } from '@storybook/react'

import { GradientAlertIcon } from './GradientAlertIcon'

const meta: Meta<typeof GradientAlertIcon> = {
  title: 'v2/Icons/GradientAlertIcon',
  component: GradientAlertIcon,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof GradientAlertIcon>

const rowStyle = { display: 'flex', gap: '16px', alignItems: 'center' }

export const AllShapes: Story = {
  render: () => (
    <div style={rowStyle}>
      <GradientAlertIcon
        gradientColor='red'
        shape='triangle'
      />
      <GradientAlertIcon
        gradientColor='backupRed'
        shape='circle'
      />
      <GradientAlertIcon
        gradientColor='yellow'
        shape='diamond'
      />
    </div>
  )
}
