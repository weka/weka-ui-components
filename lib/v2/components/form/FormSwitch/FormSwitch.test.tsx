import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormSwitch } from './FormSwitch'

interface HostValues {
  enabled: boolean
}

const SWITCH_LABEL = 'Enabled'

describe('FormSwitch', () => {
  it('renders the label with the switch reflecting the form value', () => {
    renderWithForm<HostValues>(
      <FormSwitch<HostValues>
        label={SWITCH_LABEL}
        name='enabled'
      />,
      { defaultValues: { enabled: true } }
    )

    expect(screen.getByText(SWITCH_LABEL)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('writes the toggled state to the form', () => {
    const { form } = renderWithForm<HostValues>(
      <FormSwitch<HostValues> name='enabled' />,
      { defaultValues: { enabled: false } }
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(form.getValues('enabled')).toBe(true)
  })

  it('renders the required marker after the label', () => {
    renderWithForm<HostValues>(
      <FormSwitch<HostValues>
        label={SWITCH_LABEL}
        name='enabled'
        required
      />,
      { defaultValues: { enabled: false } }
    )

    expect(screen.getByText(SWITCH_LABEL)).toHaveTextContent('*')
  })

  it('disables the switch when disabled', () => {
    renderWithForm<HostValues>(
      <FormSwitch<HostValues>
        disabled
        name='enabled'
      />,
      { defaultValues: { enabled: false } }
    )

    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
