import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { NOOP } from '../../utils/consts'
import { Button } from '../Button'

import { Popup } from './Popup'

const meta: Meta<typeof Popup> = {
  title: 'v2/Popup',
  component: Popup,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Popup>

export const Interactive: Story = {
  render: function InteractivePopup() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Popup</Button>
        <Popup
          onClose={() => setOpen(false)}
          open={open}
          title='Interactive Popup'
          actions={
            <Button
              onClick={() => setOpen(false)}
              variant='primary'
            >
              Close
            </Button>
          }
        >
          Click the close button or press Escape to close.
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
