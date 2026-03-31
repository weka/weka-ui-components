import type { Meta, StoryObj } from '@storybook/react'

import { ProtocolTags } from './ProtocolTags'

const meta: Meta<typeof ProtocolTags> = {
  title: 'v2/ProtocolTags',
  component: ProtocolTags,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'large']
    }
  }
}

export default meta
type Story = StoryObj<typeof ProtocolTags>

export const Default: Story = {
  args: {
    protocolsEnabled: { smb: true, nfs: true, s3: true, tier: true }
  }
}

export const SingleProtocol: Story = {
  args: {
    protocolsEnabled: { smb: true }
  }
}

export const SmallSize: Story = {
  args: {
    protocolsEnabled: { smb: true, nfs: true, s3: true, tier: true },
    size: 'small'
  }
}

export const LargeSize: Story = {
  args: {
    protocolsEnabled: { smb: true, nfs: true, s3: true, tier: true },
    size: 'large'
  }
}
