import type { DurationValue } from './FormDurationInput'

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithForm } from '../../../test-utils/renderWithForm'
import { DURATION_UNIT_OPTIONS } from './durationUnitOptions'
import { FormDurationInput } from './FormDurationInput'

interface HostValues {
  retention: DurationValue
}

const EMPTY_DURATION: DurationValue = {
  number: undefined,
  unit: { label: undefined, value: undefined }
}
const RETENTION_LABEL = 'Retention'
const TYPED_NUMBER = 7
const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 3600
const SECONDS_PER_DAY = 86400
const SECONDS_PER_WEEK = 604800
const SECONDS_PER_MONTH = 2592000

function renderDuration(unitOptions?: typeof DURATION_UNIT_OPTIONS) {
  return renderWithForm<HostValues>(
    <FormDurationInput<HostValues>
      label={RETENTION_LABEL}
      name='retention'
      unitOptions={unitOptions}
    />,
    { defaultValues: { retention: EMPTY_DURATION } }
  )
}

describe('DURATION_UNIT_OPTIONS', () => {
  it('lists the units from months down to seconds with their length in seconds', () => {
    expect(
      DURATION_UNIT_OPTIONS.map((option) => [option.label, option.value])
    ).toEqual([
      ['Months', SECONDS_PER_MONTH],
      ['Weeks', SECONDS_PER_WEEK],
      ['Days', SECONDS_PER_DAY],
      ['Hours', SECONDS_PER_HOUR],
      ['Minutes', SECONDS_PER_MINUTE],
      ['Seconds', 1]
    ])
  })
})

describe('FormDurationInput', () => {
  it('renders the label and defaults the unit to Min', () => {
    renderDuration()

    expect(screen.getByText(RETENTION_LABEL)).toBeInTheDocument()
    expect(screen.getByText('Min')).toBeInTheDocument()
  })

  it('adopts the Min unit into the form value once a number is typed', () => {
    const { form } = renderDuration()

    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: String(TYPED_NUMBER) }
    })

    expect(form.getValues('retention')).toEqual({
      number: TYPED_NUMBER,
      unit: { label: 'Min', value: SECONDS_PER_MINUTE }
    })
  })

  it('lists shortened unit labels in the dropdown', () => {
    renderDuration()

    fireEvent.mouseDown(screen.getByRole('combobox'))

    expect(
      screen.getByTestId(`select-option-${SECONDS_PER_HOUR}`)
    ).toHaveTextContent('Hr')
  })

  it('uses the supplied unit options instead of the defaults', () => {
    renderDuration([{ label: 'Days', value: SECONDS_PER_DAY }])

    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('binds the label to the number input', () => {
    renderDuration()

    expect(screen.getByLabelText(RETENTION_LABEL)).toBe(
      screen.getByRole('spinbutton')
    )
  })
})
