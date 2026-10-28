import type { Meta, StoryFn } from '@storybook/react'

import { type ComponentProps, type MouseEvent, useState } from 'react'

import Button from '../Button'
import { default as MenuPopperComponent } from './MenuPopper'

export default {
  title: 'Components/MenuPopper',
  component: MenuPopperComponent
} as Meta<typeof MenuPopperComponent>

function Template(args: ComponentProps<typeof MenuPopperComponent>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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
          {...args}
          anchorEl={anchorEl}
          onClickAway={handleClose}
          open={Boolean(anchorEl)}
        />
      )}
    </div>
  )
}

export const MenuPopper: StoryFn<typeof MenuPopperComponent> = Template.bind({})
MenuPopper.args = {
  items: [
    {
      onClick: () => {
        console.log('click')
      },
      text: 'Menu1',
      tooltip: 'tooltip for menu 1',
      hideMenu: false
    }
  ]
}
