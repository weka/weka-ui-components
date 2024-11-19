import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useToggle } from '~hooks'
import Collapsible from './Collapsible'

export default {
  title: 'Components/Collapsible',
  component: Collapsible
} as Meta

const Template: StoryFn = () => {
  const [expanded, toggleExpanded] = useToggle(false)

  return (
    <div style={{ height: '150px' }}>
      <Collapsible
        expanded={expanded}
        onToggle={toggleExpanded}
        label='Collapsible'
        extraClass='collapsible-content'
        headerRightContent={
          <div style={{ paddingLeft: '10px' }}>Click to get more content</div>
        }
      >
        <div style={{ padding: '16px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </div>
      </Collapsible>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {}
