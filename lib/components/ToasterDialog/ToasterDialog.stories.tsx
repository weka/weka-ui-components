import { Meta, StoryFn } from '@storybook/react'

import { default as ToasterDialogComponent } from './ToasterDialog'
import ToasterContainer from '../Toast/ToasterContainer'
import { DialogProvider } from '../../context'
import React from 'react'
import Utils from '~utils'
import Button from '../Button'

interface DialogStoryArgs {
  successMessage: string
  errorMessage: string
}

interface ToasterStoryArgs {
  successToastMessage: string
  errorToastMessage: string
}

const DialogStory = (args: DialogStoryArgs) => (
  <div style={{ display: 'flex', gap: '20px' }}>
    <Button onClick={() => Utils.toastSuccess(args.successMessage, true)}>
      Dialog Success
    </Button>
    <Button onClick={() => Utils.toastError(args.errorMessage, true)}>
      Dialog Error
    </Button>
  </div>
)

const ToasterStory = (args: ToasterStoryArgs) => (
  <div style={{ display: 'flex', gap: '20px' }}>
    <Button onClick={() => Utils.toastSuccess(args.successToastMessage)}>
      Toast Success
    </Button>
    <Button onClick={() => Utils.toastError(args.errorToastMessage)}>
      Toast Error
    </Button>
  </div>
)

export default {
  title: 'Components/ToasterDialog',
  component: ToasterDialogComponent
} as Meta

export const Dialog: StoryFn<DialogStoryArgs> = (args) => (
  <DialogProvider>
    <DialogStory {...args} />
  </DialogProvider>
)

Dialog.args = {
  successMessage:
    'This is a very long Success message that should be displayed in the toaster dialog to test the overflow of the text',
  errorMessage:
    'This is a very long Error message that should be displayed in the toaster dialog to test the overflow of the text'
}

Dialog.argTypes = {
  successMessage: { control: 'text' },
  errorMessage: { control: 'text' }
}

export const Toaster: StoryFn<ToasterStoryArgs> = (args) => (
  <DialogProvider>
    <ToasterStory {...args} />
    <div style={{ paddingTop: '20px' }}>
      <ToasterContainer />
    </div>
    <ToasterDialogComponent />
  </DialogProvider>
)

Toaster.args = {
  successToastMessage: 'This is a Success toast!',
  errorToastMessage: 'This is an Error toast!'
}

Toaster.argTypes = {
  successToastMessage: { control: 'text' },
  errorToastMessage: { control: 'text' }
}
