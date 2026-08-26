import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'

import { NOOP } from '#v2/utils/consts'

import { Button } from '../Button'
import { Popup } from './Popup'

const meta: Meta<typeof Popup> = {
  title: 'v2/Popup',
  component: Popup,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Popup>

const COLLAPSED_WIDTH = 636
const EXPANDED_WIDTH = 1140

export const Interactive: Story = {
  render: function InteractivePopup() {
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Popup</Button>
        <Popup
          onClose={() => setOpen(false)}
          open={open}
          title='Interactive Popup'
          width={expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH}
          actions={
            <>
              <Button
                onClick={() => setExpanded(!expanded)}
                variant='secondary'
              >
                {expanded ? 'Collapse' : 'Expand'}
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant='primary'
              >
                Close
              </Button>
            </>
          }
        >
          Click the close button or press Escape to close. Expand animates the
          popup width.
        </Popup>
      </>
    )
  }
}

export const Default: Story = {
  args: {
    open: true,
    title: 'Popup Title',
    onClose: NOOP,
    children: 'This is the popup content.'
  }
}

export const WithActions: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    onClose: NOOP,
    children: 'Are you sure you want to proceed?',
    actions: (
      <>
        <Button variant='secondary'>Cancel</Button>
        <Button variant='primary'>Confirm</Button>
      </>
    )
  }
}
