import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormRadioGroup } from './FormRadioGroup'

interface HostValues {
  mode: string
}

const MODE_LABEL = 'Mode'
const OPTIONS = [
  { label: 'Manual', value: 'manual' },
  { label: 'Automatic', value: 'auto' }
]

describe('FormRadioGroup', () => {
  it('renders the field label and the checked option', () => {
    renderWithForm<HostValues>(
      <FormRadioGroup<HostValues>
        label={MODE_LABEL}
        name='mode'
        options={OPTIONS}
      />,
      { defaultValues: { mode: 'manual' } }
    )

    expect(screen.getByText(MODE_LABEL)).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Manual' })).toBeChecked()
  })

  it('writes the chosen option to the form', () => {
    const { form } = renderWithForm<HostValues>(
      <FormRadioGroup<HostValues>
        name='mode'
        options={OPTIONS}
      />,
      { defaultValues: { mode: 'manual' } }
    )

    fireEvent.click(screen.getByRole('radio', { name: 'Automatic' }))

    expect(form.getValues('mode')).toBe('auto')
  })

  it('disables every option when disabled', () => {
    renderWithForm<HostValues>(
      <FormRadioGroup<HostValues>
        disabled
        name='mode'
        options={OPTIONS}
      />,
      { defaultValues: { mode: 'manual' } }
    )

    expect(screen.getByRole('radio', { name: 'Automatic' })).toBeDisabled()
  })
})
