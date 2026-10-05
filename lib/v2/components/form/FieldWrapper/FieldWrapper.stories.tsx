import type { Meta, StoryObj } from '@storybook/react'

import { FieldWrapper } from './FieldWrapper'

const FIELD_ID = 'field-wrapper-story'

const meta: Meta<typeof FieldWrapper> = {
  title: 'v2/form/FieldWrapper',
  component: FieldWrapper,
  tags: ['autodocs'],
  args: {
    htmlFor: FIELD_ID,
    label: 'Label',
    children: <input id={FIELD_ID} />
  }
}

export default meta
type Story = StoryObj<typeof FieldWrapper>

export const Default: Story = {}

export const Required: Story = { args: { required: true } }

export const WithInfo: Story = { args: { info: 'Explains the field' } }

export const WithError: Story = { args: { error: 'This field is invalid' } }

export const SpanLabel: Story = { args: { htmlFor: undefined } }
