import { default as MenuPopperComponent } from './MenuPopper.js'
import Button from '../Button/Button.js'
import { useState } from 'react'

export default {
  title: "Components/MenuPopper",
  component: MenuPopperComponent,
  argTypes: {
    open: { description: 'Is popper open', type: { name: 'boolean', required: true }, },
    anchorEl: { description: 'Anchor for the menu' },
    items: { description: 'Menu items', type: { name: 'object', required: true }, }
  },
}

const Template = args => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = event => {
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
