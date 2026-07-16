import type { Meta, StoryObj } from '@storybook/react'

import { LegendItem } from './LegendItem'

import styles from '../capacityWidget.module.scss'

const meta: Meta<typeof LegendItem> = {
  title: 'v2/Widgets/CapacityWidget/LegendItem',
  component: LegendItem
}

export default meta
type Story = StoryObj<typeof LegendItem>

export const WithDot: Story = {
  args: {
    label: 'Used',
    amount: { value: '406.5', unit: 'TB' },
    dotClass: styles.dotUsed
  }
}

export const WithoutDot: Story = {
  args: {
    label: 'Total Provisioned',
    amount: { value: '5.1', unit: 'PB' }
  }
}
