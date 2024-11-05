import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useToggle } from '../../hooks'
import { ThinArrow } from '../../svgs'
import Collapsible from './Collapsible'

export default {
  title: 'Components/Collapsible',
  component: Collapsible
} as Meta

const Template: StoryFn = () => {
  const [expanded, toggleExpanded] = useToggle(false)

  return (
    <div style={{ height: '150px' }}>
      <div
        className='collapsible-header'
        onClick={toggleExpanded}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}
      >
        <ThinArrow
          style={{
            width: '16px',
            height: '16px',
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        />
        Click Here To Toggle!
      </div>
      <Collapsible expanded={expanded} extraClass='collapsible-content'>
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
