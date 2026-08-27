import type { Meta, StoryObj } from '@storybook/react'

import { SECTION_MESSAGE_VARIANTS, SectionMessage } from './SectionMessage'

const meta: Meta<typeof SectionMessage> = {
  title: 'v2/SectionMessage',
  component: SectionMessage,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof SectionMessage>

export const Info: Story = {
  args: {
    message: 'Data availability is calculated from the last full scrub cycle.'
  }
}

export const Warning: Story = {
  args: {
    message: 'Changing the password revokes all active sessions for this user.',
    variant: SECTION_MESSAGE_VARIANTS.WARNING
  }
}

export const WithLabel: Story = {
  args: {
    label: 'S3 user password',
    message:
      'Changing the password also regenerates the S3 secret key for this user.',
    variant: SECTION_MESSAGE_VARIANTS.WARNING
  }
}

export const Compact: Story = {
  args: {
    compact: true,
    message:
      'Filesystems created before version 5.1.20 require the DataServ container to be installed.'
  }
}
