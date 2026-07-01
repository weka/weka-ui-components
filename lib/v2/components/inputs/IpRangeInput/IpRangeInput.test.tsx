import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { IpRangeInput } from './IpRangeInput'

const TOTAL_OCTET_INPUTS = 8

const RANGE_BASIC = '10.0.0.1-10.0.0.50'
const RANGE_DETAILED = '192.168.1.1-192.168.1.100'

const OCTET_192 = 192
const OCTET_168 = 168
const OCTET_1 = 1
const OCTET_100 = 100
const OCTET_5 = 5
const OCTET_99 = 99

describe('IpRangeInput', () => {
  it('renders 8 number inputs (4 per IP)', () => {
    render(
      <IpRangeInput
        onChange={vi.fn()}
        value={RANGE_BASIC}
      />
    )
    expect(screen.getAllByRole('spinbutton')).toHaveLength(TOTAL_OCTET_INPUTS)
  })

  it('splits the value on the first hyphen and populates both IpInputs', () => {
    render(
      <IpRangeInput
        onChange={vi.fn()}
        value={RANGE_DETAILED}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs[0]).toHaveValue(OCTET_192)
    expect(inputs[1]).toHaveValue(OCTET_168)
    expect(inputs[2]).toHaveValue(OCTET_1)
    expect(inputs[3]).toHaveValue(OCTET_1)
    expect(inputs[4]).toHaveValue(OCTET_192)
    expect(inputs[5]).toHaveValue(OCTET_168)
    expect(inputs[6]).toHaveValue(OCTET_1)
    expect(inputs[7]).toHaveValue(OCTET_100)
  })

  it('emits combined start-end string when start changes', () => {
    const onChange = vi.fn()
    render(
      <IpRangeInput
        onChange={onChange}
        value={RANGE_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[3], { target: { value: String(OCTET_5) } })
    expect(onChange).toHaveBeenCalledWith('10.0.0.5-10.0.0.50')
  })

  it('emits combined start-end string when end changes', () => {
    const onChange = vi.fn()
    render(
      <IpRangeInput
        onChange={onChange}
        value={RANGE_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[7], { target: { value: String(OCTET_99) } })
    expect(onChange).toHaveBeenCalledWith('10.0.0.1-10.0.0.99')
  })

  it('emits EMPTY_STRING when required=true and start becomes blank', () => {
    const onChange = vi.fn()
    render(
      <IpRangeInput
        onChange={onChange}
        required
        value={RANGE_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: EMPTY_STRING } })
    expect(onChange).toHaveBeenCalledWith(EMPTY_STRING)
  })

  it('shows the label when provided', () => {
    render(
      <IpRangeInput
        label='IP Range'
        onChange={vi.fn()}
        value={EMPTY_STRING}
      />
    )
    expect(screen.getByText('IP Range')).toBeInTheDocument()
  })

  it('shows required star when required=true and label is set', () => {
    render(
      <IpRangeInput
        label='IP Range'
        onChange={vi.fn()}
        required
        value={EMPTY_STRING}
      />
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })
})
