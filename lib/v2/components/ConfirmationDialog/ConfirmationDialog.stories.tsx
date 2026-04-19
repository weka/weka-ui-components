import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Button } from '../Button'

import {
  CONFIRM_BUTTON_VARIANTS,
  ConfirmationDialog
} from './ConfirmationDialog'

const meta: Meta<typeof ConfirmationDialog> = {
  title: 'v2/ConfirmationDialog',
  component: ConfirmationDialog,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof ConfirmationDialog>

function InteractiveExample() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <ConfirmationDialog
        confirmText='Delete'
        message='Are you sure you want to delete this item?'
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        subMessage='This action cannot be undone.'
        title='Confirm Delete'
      />
    </>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveExample />
}

export const DangerConfirm: Story = {
  args: {
    open: true,
    title: 'Delete Token',
    message: 'Are you sure you want to delete this token?',
    subMessage: 'This action cannot be undone.',
    confirmText: 'Delete',
    confirmButtonVariant: CONFIRM_BUTTON_VARIANTS.DANGER,
    onConfirm: () => {},
    onCancel: () => {}
  }
}

export const PrimaryConfirm: Story = {
  args: {
    open: true,
    title: 'Save Changes',
    message: 'Do you want to save the current configuration?',
    confirmText: 'Save',
    confirmButtonVariant: CONFIRM_BUTTON_VARIANTS.PRIMARY,
    onConfirm: () => {},
    onCancel: () => {}
  }
}

export const Confirming: Story = {
  args: {
    open: true,
    title: 'Delete Tab',
    message: 'Are you sure you want to delete this tab?',
    confirmText: 'Delete',
    isConfirming: true,
    onConfirm: () => {},
    onCancel: () => {}
  }
}
