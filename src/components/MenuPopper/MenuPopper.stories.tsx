import { default as MenuPopperComponent } from './MenuPopper'
import Button from '../Button'
import { useState } from 'react'
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from 'react';

export default {
  title: "Components/MenuPopper",
  component: MenuPopperComponent
} as ComponentMeta<typeof MenuPopperComponent>

const Template: ComponentStory<typeof MenuPopperComponent> = args => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button onClick={handleClick}>
        Open popper
      </Button>
      {Boolean(anchorEl) && (<MenuPopperComponent
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClickAway={handleClose}
        items={[]}
        {...args} />)}
    </div>
  )
}

export const MenuPopper = Template.bind({})
MenuPopper.args = {
  items: [{
    onClick: () => {
      console.log('click')
    },
    text: 'Menu1',
    tooltip: 'tooltip for menu 1',
    disabled: false,
    hideMenu: false
  }]
}
