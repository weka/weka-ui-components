import type { Meta, StoryObj } from '@storybook/react'

import { NOOP } from '../../utils/consts'
import { Button } from '../Button'

import { Tooltip } from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  title: 'v2/Tooltip',
  component: Tooltip,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    data: 'This is a tooltip',
    children: <Button onClick={NOOP}>Hover me</Button>
  }
}

export const WithReactContent: Story = {
  args: {
    data: (
      <div>
        <strong>Bold title</strong>
        <p>With paragraph content</p>
      </div>
    ),
    children: <Button onClick={NOOP}>Rich tooltip</Button>
  }
}

export const TopPlacement: Story = {
  args: {
    data: 'Tooltip on top',
    placement: 'top',
    children: <Button onClick={NOOP}>Top tooltip</Button>
  }
}

export const RightPlacement: Story = {
  args: {
    data: 'Tooltip on right',
    placement: 'right',
    children: <Button onClick={NOOP}>Right tooltip</Button>
  }
}

export const Ellipsis: Story = {
  render: () => (
    <div style={{ width: '120px' }}>
      <Tooltip
        data='This is a very long text that will be truncated with ellipsis'
        ellipsis
        enterDelay={0}
      >
        This is a very long text that will be truncated with ellipsis
      </Tooltip>
    </div>
  )
}

export const WithCustomDelay: Story = {
  args: {
    data: 'Shows after 200ms',
    enterDelay: 200,
    children: <Button onClick={NOOP}>Custom delay</Button>
  }
}

