import type { CapacityWidgetLabels } from '../types'
import type { Meta, StoryObj } from '@storybook/react'

import { ProvisionedSection } from './ProvisionedSection'

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

const meta: Meta<typeof ProvisionedSection> = {
  title: 'v2/Widgets/CapacityWidget/ProvisionedSection',
  component: ProvisionedSection,
  args: { labels: LABELS, totalUnit: 'TB' }
}

export default meta
type Story = StoryObj<typeof ProvisionedSection>

export const WithObs: Story = {
  args: {
    ssd: {
      written: 943,
      provisioned: 1400,
      writtenDisplay: '943 TB',
      provisionedDisplay: '1.4 PB'
    },
    obs: {
      written: 2500,
      provisioned: 3700,
      writtenDisplay: '2.5 PB',
      provisionedDisplay: '3.7 PB'
    },
    total: 5100,
    totalDisplay: '5.1 PB'
  }
}

export const WithoutObs: Story = {
  args: {
    ssd: {
      written: 943,
      provisioned: 1400,
      writtenDisplay: '943 TB',
      provisionedDisplay: '1.4 PB'
    },
    total: 1400,
    totalDisplay: '1.4 PB'
  }
}
