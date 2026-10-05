import type { Meta, StoryObj } from '@storybook/react'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { EMPTY_STRING, NOOP } from '#v2/utils/consts'

import { Button } from '../../Button'
import { FormTextInput } from '../FormTextInput'
import { FormPopup } from './FormPopup'

interface StoryValues {
  name: string
}

interface FormPopupDemoProps {
  error?: string
  isSubmitting?: boolean
  submitText?: string
  cancelText?: string
  submitDisabled?: boolean
}

function FormPopupDemo({
  error,
  isSubmitting,
  submitText,
  cancelText,
  submitDisabled
}: Readonly<FormPopupDemoProps>) {
  const [open, setOpen] = useState(false)
  const form = useForm<StoryValues>({ defaultValues: { name: EMPTY_STRING } })

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open form popup</Button>
      <FormPopup
        cancelText={cancelText}
        error={error}
        form={form}
        isSubmitting={isSubmitting}
        onClose={() => setOpen(false)}
        onSubmit={NOOP}
        open={open}
        submitDisabled={submitDisabled}
        submitText={submitText}
        title='Create item'
      >
        <FormTextInput<StoryValues>
          label='Name'
          name='name'
          required
        />
      </FormPopup>
    </>
  )
}

const meta: Meta<typeof FormPopupDemo> = {
  title: 'v2/form/FormPopup',
  component: FormPopupDemo,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof FormPopupDemo>

export const Default: Story = {}

export const WithError: Story = {
  args: { error: 'The item could not be created.' }
}

export const Submitting: Story = { args: { isSubmitting: true } }

export const SubmitDisabled: Story = { args: { submitDisabled: true } }

export const CustomLabels: Story = {
  args: { submitText: 'Create', cancelText: 'Discard' }
}
