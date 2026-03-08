import React, { useState } from 'react'
import type { ComponentMeta, ComponentStory } from '@storybook/react'

import Button from '../Button'

import { default as MenuPopperComponent } from './MenuPopper'

export default {
  title: 'Components/MenuPopper',
  component: MenuPopperComponent
} as ComponentMeta<typeof MenuPopperComponent>

const Template: ComponentStory<typeof MenuPopperComponent> = (args) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div>
      <Button onClick={handleClick}>Open popper</Button>
      {Boolean(anchorEl) && (
        <MenuPopperComponent
          anchorEl={anchorEl}
          items={[]}
          onClickAway={handleClose}
          open={Boolean(anchorEl)}
          {...args}
        />
      )}
    </div>
  )
}

export const MenuPopper = Template.bind({})
MenuPopper.args = {
  items: [
    {
      onClick: () => {
        console.log('click')
      },
      text: 'Menu1',
      tooltip: 'tooltip for menu 1',
      disabled: false,
      hideMenu: false
    }
  ]
}
