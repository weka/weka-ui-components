import type { Meta, StoryObj } from '@storybook/react'

import { CollapsibleText } from './CollapsibleText'

const meta: Meta<typeof CollapsibleText> = {
  title: 'v2/CollapsibleText',
  component: CollapsibleText,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CollapsibleText>

const LONG_TEXT =
  'This alert was raised because a drive in the cluster reported elevated error rates over a sustained period. The system has flagged it for review so an operator can decide whether to phase the drive out or continue monitoring it.'

const containerStyle = { width: '320px' }

export const Default: Story = {
  args: {
    text: LONG_TEXT
  },
  render: (args) => (
    <div style={containerStyle}>
      <CollapsibleText {...args} />
    </div>
  )
}

export const ShortText: Story = {
  args: {
    text: 'A brief message that fits on a single line.'
  }
}
