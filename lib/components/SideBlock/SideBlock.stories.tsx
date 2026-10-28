import type { SideBlockProps } from './SideBlock'
import type { Meta, StoryFn } from '@storybook/react'

import React from 'react'
import { action } from 'storybook/actions'
import { useToggle } from '#hooks'

import { default as SideBlockComponent } from './SideBlock'

export default {
  title: 'Components/SideBlock',
  component: SideBlockComponent,
  argTypes: {
    actions: {
      description: 'Array of actions',
      type: { name: 'other', value: 'object', required: false }
    },
    description: {
      description: 'Description of the side block',
      type: { name: 'string', required: false }
    },
    info: {
      description: 'Info to be displayed',
      type: { name: 'other', value: 'object', required: false }
    },
    isSelected: {
      description: 'Is the side block selected',
      type: { name: 'boolean', required: false }
    },
    name: {
      description: 'Title of the side block',
      type: { name: 'string', required: true }
    },
    onSelect: {
      description: 'Function to be called on select',
      type: { name: 'function', required: true }
    },
    SubComponent: {
      description: 'Sub component to be displayed under the name',
      type: { name: 'other', value: 'object', required: false }
    }
  }
} as Meta<typeof SideBlockComponent>

function Template(args: SideBlockProps) {
  const [selected, toggleSelected] = useToggle(false)
  return (
    <SideBlockComponent
      {...args}
      isSelected={selected}
      onSelect={toggleSelected}
    />
  )
}

export const SideBlock: StoryFn<typeof SideBlockComponent> = Template.bind({})
SideBlock.args = {
  name: 'Test Side Block',
  actions: [
    {
      onClick: action('Deleting a block'),
      text: 'Delete'
    }
  ],
  description: 'This is the test block',
  info: 'This is the test block'
}
