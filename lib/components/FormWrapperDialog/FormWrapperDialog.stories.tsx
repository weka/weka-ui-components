import type { FormDialogProps } from './FormWrapperDialog'
import type { Meta, StoryFn } from '@storybook/react'

import React from 'react'
import { useForm } from 'react-hook-form'
import { action } from '@storybook/addon-actions'
import { FORM_VALIDATIONS } from '#consts'
import { useToggle } from '#hooks'
import { DateTime } from 'luxon'

import Button from '../Button'
import ControlDatePicker from './ControlInputs/ControlDatePicker'
import ControlTextBox from './ControlInputs/ControlTextBox'
import { default as FormWrapperDialog } from './FormWrapperDialog'

export default {
  title: 'Components/FormWrapperDialog',
  component: FormWrapperDialog
} as Meta

const Template: StoryFn<typeof FormWrapperDialog> = (args: FormDialogProps) => {
  const { control, handleSubmit } = useForm()
  const [isOpen, toggleOpen] = useToggle(false)

  const onSubmit = async () => {
    action('Submit')
    await Promise.resolve()
    toggleOpen()
  }

  return (
    <>
      <Button onClick={toggleOpen}>Open Dialog</Button>
      <FormWrapperDialog
        handleSubmit={handleSubmit(onSubmit)}
        isOpen={isOpen}
        showSubmit
        title='Dialog Title'
        toggleOpen={toggleOpen}
        {...args}
      >
        <ControlTextBox
          control={control}
          label='Name'
          name='name'
          rules={{
            required: FORM_VALIDATIONS.REQUIRED
          }}
        />
        <ControlDatePicker
          control={control}
          defaultValue={DateTime.now()}
          label='Birth Date'
          name='birthDate'
        />
      </FormWrapperDialog>
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  info: 'This is the dialog information',
  disabled: false,
  submitText: 'Save'
}
