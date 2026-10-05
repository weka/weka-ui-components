import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { FormToggleSection } from './FormToggleSection'

const TEST_ID = 'toggle-section'
const LABEL = 'Data Reduction'
const CONTENT_TEXT = 'expanded content'

describe('FormToggleSection', () => {
  it('renders the label with the toggle off by default', () => {
    renderWithForm(
      <FormToggleSection
        dataTestId={TEST_ID}
        label={LABEL}
        name='data_reduction'
      >
        <span>{CONTENT_TEXT}</span>
      </FormToggleSection>
    )

    expect(screen.getByText(LABEL)).toBeInTheDocument()
    expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument()
  })

  it('writes the toggle state into the form and reveals children', () => {
    const { form } = renderWithForm(
      <FormToggleSection
        dataTestId={TEST_ID}
        label={LABEL}
        name='data_reduction'
      >
        <span>{CONTENT_TEXT}</span>
      </FormToggleSection>,
      { defaultValues: { data_reduction: false } }
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(form.getValues('data_reduction')).toBe(true)
    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument()
  })

  it('shows children when the form value defaults to on', () => {
    renderWithForm(
      <FormToggleSection
        dataTestId={TEST_ID}
        label={LABEL}
        name='data_reduction'
      >
        <span>{CONTENT_TEXT}</span>
      </FormToggleSection>,
      { defaultValues: { data_reduction: true } }
    )

    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument()
  })

  it('disables the switch when disabled', () => {
    renderWithForm(
      <FormToggleSection
        dataTestId={TEST_ID}
        disabled
        label={LABEL}
        name='data_reduction'
      />
    )

    expect(screen.getByRole('checkbox')).toBeDisabled()
  })
})
