import type { CapacityValue } from './FormCapacityInput'

import { useForm } from 'react-hook-form'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormPopup } from '../FormPopup'
import { FormCapacityInput } from './FormCapacityInput'

const KILO = 1000
const MB_VALUE = KILO * KILO
const GB_VALUE = MB_VALUE * KILO
const TB_VALUE = GB_VALUE * KILO
const BYTES_VALUE = 1
const TYPED_FIVE = '5'
const TYPED_SEVEN = '7'
const FIVE = 5
const SAVE_BUTTON = 'Save'
const GB_LABEL = 'GB'
const MB_LABEL = 'MB'

const UNIT_OPTIONS = [
  { label: 'TB', value: TB_VALUE },
  { label: GB_LABEL, value: GB_VALUE },
  { label: MB_LABEL, value: MB_VALUE },
  { label: 'Bytes', value: BYTES_VALUE }
]

interface HostValues {
  capacity: CapacityValue
}

const EMPTY_CAPACITY: CapacityValue = {
  number: undefined,
  unit: { label: undefined, value: undefined }
}

const RATE_UNIT_OPTIONS = UNIT_OPTIONS.map((option) => ({
  ...option,
  label: `${option.label}/s`
}))

function Host({
  onValues,
  defaultValue = EMPTY_CAPACITY,
  unitOptions = UNIT_OPTIONS,
  label = 'Capacity',
  info,
  required
}: Readonly<{
  onValues?: (values: HostValues) => void
  defaultValue?: CapacityValue
  unitOptions?: typeof UNIT_OPTIONS
  label?: string
  info?: string
  required?: boolean
}>) {
  const form = useForm<HostValues>({
    defaultValues: { capacity: defaultValue }
  })

  return (
    <FormPopup
      form={form}
      onClose={() => undefined}
      onSubmit={(values) => onValues?.(values)}
      open
      submitText={SAVE_BUTTON}
      title='Host'
    >
      <FormCapacityInput<HostValues>
        info={info}
        label={label}
        name='capacity'
        required={required}
        unitOptions={unitOptions}
      />
    </FormPopup>
  )
}

async function submitAfterTyping(typed: string) {
  fireEvent.change(await screen.findByRole('spinbutton'), {
    target: { value: typed }
  })
  fireEvent.click(screen.getByRole('button', { name: SAVE_BUTTON }))
}

describe('FormCapacityInput', () => {
  it('shows the GB default unit when the value carries no unit', async () => {
    render(<Host />)

    expect(await screen.findByText(GB_LABEL)).toBeInTheDocument()
  })

  it('renders the label with a required marker', async () => {
    render(<Host required />)

    expect(await screen.findByText('Capacity')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows the GB/s default for rate options when the value carries no unit', async () => {
    render(<Host unitOptions={RATE_UNIT_OPTIONS} />)

    expect(await screen.findByText('GB/s')).toBeInTheDocument()
    expect(screen.queryByText('TB/s')).not.toBeInTheDocument()
  })

  it('adopts the default unit into the form value once a number is typed', async () => {
    const submitted: HostValues[] = []
    render(<Host onValues={(values) => submitted.push(values)} />)

    await submitAfterTyping(TYPED_FIVE)

    await waitFor(() => {
      expect(submitted).toHaveLength(1)
    })
    expect(submitted[0].capacity).toEqual({
      number: FIVE,
      unit: { label: GB_LABEL, value: GB_VALUE }
    })
  })

  it('keeps a unit already present in the value instead of the default', async () => {
    const submitted: HostValues[] = []
    render(
      <Host
        onValues={(values) => submitted.push(values)}
        defaultValue={{
          number: undefined,
          unit: { label: MB_LABEL, value: MB_VALUE }
        }}
      />
    )

    await submitAfterTyping(TYPED_SEVEN)

    await waitFor(() => {
      expect(submitted).toHaveLength(1)
    })
    expect(submitted[0].capacity.unit).toEqual({
      label: MB_LABEL,
      value: MB_VALUE
    })
  })

  it('lists shortened unit labels in the dropdown', async () => {
    render(<Host />)

    fireEvent.mouseDown(await screen.findByRole('combobox'))

    expect(
      await screen.findByTestId(`select-option-${BYTES_VALUE}`)
    ).toHaveTextContent(/^B$/)
    expect(screen.queryByText('Bytes')).not.toBeInTheDocument()
  })
})
