import type { Meta, StoryObj } from '@storybook/react'

import { type RefObject, useRef, useState } from 'react'

import { Button } from '../Button'
import { MENU_POPOVER_STYLES, MenuPopover } from './MenuPopover'

const meta: Meta<typeof MenuPopover> = {
  title: 'v2/MenuPopover',
  component: MenuPopover,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof MenuPopover>

const wrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '40px'
}

function MenuPopoverExample({
  compact = false
}: Readonly<{ compact?: boolean }>) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <div style={wrapperStyle}>
      <Button
        ref={anchorRef}
        onClick={() => setOpen((v) => !v)}
      >
        Open Menu
      </Button>
      <MenuPopover
        anchorRef={anchorRef as RefObject<HTMLElement>}
        compact={compact}
        onClose={() => setOpen(false)}
        open={open}
      >
        <button
          className={MENU_POPOVER_STYLES.menuItem}
          onClick={() => setOpen(false)}
          type='button'
        >
          Edit
        </button>
        <button
          className={MENU_POPOVER_STYLES.menuItem}
          onClick={() => setOpen(false)}
          type='button'
        >
          Duplicate
        </button>
        <button
          className={MENU_POPOVER_STYLES.menuItem}
          onClick={() => setOpen(false)}
          type='button'
        >
          Remove
        </button>
      </MenuPopover>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <MenuPopoverExample />
}

export const Compact: Story = {
  render: () => <MenuPopoverExample compact />
}
