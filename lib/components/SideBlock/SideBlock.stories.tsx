import { default as SideBlockComponent, SideBlockProps } from './SideBlock'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { useToggle } from '../../hooks'

export default {
  title: 'Components/SideBlock',
  component: SideBlockComponent,
  argTypes: {
    actions: {
      description: 'Array of actions',
      type: { name: 'object', required: false }
    },
    description: {
      description: 'Description of the side block',
      type: { name: 'string', required: false }
    },
    info: {
      description: 'Info to be displayed',
      type: { name: 'object', required: false }
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
      type: { name: 'object', required: false }
    }
  }
} as ComponentMeta<typeof SideBlockComponent>

const Template: ComponentStory<typeof SideBlockComponent> = (
  args: SideBlockProps
) => {
  const [selected, toggleSelected] = useToggle(false)
  return (
    <SideBlockComponent
      onSelect={toggleSelected}
      isSelected={selected}
      {...args}
    />
  )
}

export const SideBlock = Template.bind({})
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
