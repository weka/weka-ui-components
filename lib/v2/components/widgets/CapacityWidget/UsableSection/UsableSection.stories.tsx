import type { CapacityWidgetLabels } from '../types'
import type { Meta, StoryObj } from '@storybook/react'

import { UsableSection } from './UsableSection'

const LABELS: CapacityWidgetLabels = {
  used: 'Used',
  free: 'Free',
  totalUsable: 'Total Usable',
  dataReduction: 'Data Reduction',
  saving: 'Saving',
  written: 'Written',
  provisioned: 'Provisioned',
  totalProvisioned: 'Total Provisioned',
  ssd: 'SSD',
  obs: 'OBS'
}

const meta: Meta<typeof UsableSection> = {
  title: 'v2/Widgets/CapacityWidget/UsableSection',
  component: UsableSection,
  args: { labels: LABELS }
}

export default meta
type Story = StoryObj<typeof UsableSection>

export const WithDataReduction: Story = {
  args: {
    data: {
      used: 406.5,
      free: 312.2,
      total: 718.7,
      unit: 'TB',
      dataReduction: { ratio: '2.32:1', savings: '536.4 TB' }
    }
  }
}

export const WithoutDataReduction: Story = {
  args: {
    data: { used: 406.5, free: 312.2, total: 718.7, unit: 'TB' }
  }
}
