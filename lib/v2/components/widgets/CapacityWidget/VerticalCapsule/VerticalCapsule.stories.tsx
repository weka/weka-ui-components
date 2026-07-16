import type { Meta, StoryObj } from '@storybook/react'

import { CAPSULE_TONES, VerticalCapsule } from './VerticalCapsule'

const meta: Meta<typeof VerticalCapsule> = {
  title: 'v2/Widgets/CapacityWidget/VerticalCapsule',
  component: VerticalCapsule
}

export default meta
type Story = StoryObj<typeof VerticalCapsule>

export const Ssd: Story = {
  args: { label: 'SSD', fillPercentage: 35, tone: CAPSULE_TONES.SSD }
}

export const Obs: Story = {
  args: { label: 'OBS', fillPercentage: 68, tone: CAPSULE_TONES.OBS }
}

export const Wide: Story = {
  args: { label: 'SSD', fillPercentage: 50, tone: CAPSULE_TONES.SSD, wide: true }
}

export const Full: Story = {
  args: { label: 'SSD', fillPercentage: 100, tone: CAPSULE_TONES.SSD }
}
