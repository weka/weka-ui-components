import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import {
  default as FormWrapperDialog,
  FormDialogProps
} from './FormWrapperDialog'
import ControlTextBox from './ControlInputs/ControlTextBox'
import { useForm } from 'react-hook-form'
import Button from '../Button'
import { useToggle } from 'hooks'
import { action } from '@storybook/addon-actions'
import ControlDatePicker from './ControlInputs/ControlDatePicker'
import { DateTime } from 'luxon'
import { FORM_VALIDATIONS } from 'consts'

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
        title='Dialog Title'
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        showSubmit
        handleSubmit={handleSubmit(onSubmit)}
        {...args}
      >
        <ControlTextBox
          control={control}
          name='name'
          label='Name'
          rules={{
            required: FORM_VALIDATIONS.REQUIRED
          }}
        />
        <ControlDatePicker
          label='Birth Date'
          control={control}
          name='birthDate'
          defaultValue={DateTime.now()}
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
