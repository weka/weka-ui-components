import type { Mode } from 'react-hook-form'

import { act, fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormTextInput } from './FormTextInput'

interface HostValues {
  hostname: string
}

const HOSTNAME_LABEL = 'Hostname'
const TYPED_VALUE = 'node-1'
const REQUIRED_MESSAGE = 'Hostname is required'

function renderInput(
  props: Partial<Parameters<typeof FormTextInput<HostValues>>[0]> = {},
  mode?: Mode
) {
  return renderWithForm<HostValues>(
    <FormTextInput<HostValues>
      label={HOSTNAME_LABEL}
      name='hostname'
      {...props}
    />,
    { defaultValues: { hostname: EMPTY_STRING }, mode }
  )
}

describe('FormTextInput', () => {
  it('renders its label bound to the input', () => {
    renderInput()

    expect(screen.getByLabelText(HOSTNAME_LABEL)).toBe(
      screen.getByRole('textbox')
    )
  })

  it('writes typed text to the form', () => {
    const { form } = renderInput()

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: TYPED_VALUE }
    })

    expect(form.getValues('hostname')).toBe(TYPED_VALUE)
  })

  it('shows the validation error from the rules', async () => {
    const { form } = renderInput({ rules: { required: REQUIRED_MESSAGE } })

    await act(async () => {
      await form.trigger()
    })

    expect(screen.getByText(REQUIRED_MESSAGE)).toBeInTheDocument()
  })

  it('renders an empty value when the form has none yet', () => {
    renderWithForm<HostValues>(
      <FormTextInput<HostValues>
        label={HOSTNAME_LABEL}
        name='hostname'
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue(EMPTY_STRING)
  })

  it('disables the input when disabled', () => {
    renderInput({ disabled: true })

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('forwards the input type', () => {
    renderInput({ type: 'email' })

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('forwards the field name to the input', () => {
    renderInput()

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'hostname')
  })

  it('marks the field touched on blur', () => {
    const { form } = renderInput()

    fireEvent.blur(screen.getByRole('textbox'))

    expect(form.getFieldState('hostname').isTouched).toBe(true)
  })

  it('validates on blur when the form mode is onBlur', async () => {
    const { form } = renderInput(
      { rules: { required: REQUIRED_MESSAGE } },
      'onBlur'
    )

    await act(async () => {
      fireEvent.blur(screen.getByRole('textbox'))
      await form.trigger('hostname')
    })

    expect(screen.getByText(REQUIRED_MESSAGE)).toBeInTheDocument()
  })

  it('focuses the input through setFocus', () => {
    const { form } = renderInput()

    vi.useFakeTimers()
    act(() => {
      form.setFocus('hostname')
    })
    act(() => {
      vi.runAllTimers()
    })
    vi.useRealTimers()

    expect(screen.getByRole('textbox')).toHaveFocus()
  })
})
