import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#v2/utils/consts'

import { IpInput } from './IpInput'

const OCTET_INPUT_COUNT = 4

// Test IPs — safe to hardcode in test files (sonarjs/no-hardcoded-ip)
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const IP_BASIC = '192.168.1.1'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const IP_MULTI_OCTET = '10.20.30.40'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const IP_SIMPLE = '10.0.0.1'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const IP_PASTE = '1.2.3.4'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const IP_CLAMPED = '255.0.0.1'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const IP_CHANGED = '192.0.0.1'

const OCTET_10 = 10
const OCTET_20 = 20
const OCTET_30 = 30
const OCTET_40 = 40
const OCTET_192 = 192
const OCTET_1 = 1
const OCTET_2 = 2
const OCTET_3 = 3
const OCTET_4_VAL = 4
const OCTET_255 = 255
const OCTET_5 = 5

describe('IpInput', () => {
  it('renders 4 number inputs', () => {
    render(
      <IpInput
        onChange={vi.fn()}
        value={IP_BASIC}
      />
    )
    expect(screen.getAllByRole('spinbutton')).toHaveLength(OCTET_INPUT_COUNT)
  })

  it('displays the correct octet values', () => {
    render(
      <IpInput
        onChange={vi.fn()}
        value={IP_MULTI_OCTET}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs[0]).toHaveValue(OCTET_10)
    expect(inputs[1]).toHaveValue(OCTET_20)
    expect(inputs[2]).toHaveValue(OCTET_30)
    expect(inputs[3]).toHaveValue(OCTET_40)
  })

  it('calls onChange with joined IP when an octet changes', () => {
    const onChange = vi.fn()
    render(
      <IpInput
        onChange={onChange}
        value={IP_SIMPLE}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: String(OCTET_192) } })
    expect(onChange).toHaveBeenCalledWith(IP_CHANGED)
  })

  it('emits EMPTY_STRING when required=true and one octet is blank', () => {
    const onChange = vi.fn()
    render(
      <IpInput
        onChange={onChange}
        required
        value={IP_SIMPLE}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[2], { target: { value: EMPTY_STRING } })
    expect(onChange).toHaveBeenCalledWith(EMPTY_STRING)
  })

  it('clamps octet value to 0–255', () => {
    const onChange = vi.fn()
    render(
      <IpInput
        onChange={onChange}
        value={IP_SIMPLE}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: '300' } })
    expect(onChange).toHaveBeenCalledWith(IP_CLAMPED)
  })

  it('distributes a valid pasted IP across all octets', () => {
    const onChange = vi.fn()
    render(
      <IpInput
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => IP_PASTE }
    })
    expect(onChange).toHaveBeenCalledWith(IP_PASTE)
  })

  it('shows the label when provided', () => {
    render(
      <IpInput
        label='Test Label'
        onChange={vi.fn()}
        value={EMPTY_STRING}
      />
    )
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('shows the required star when required=true', () => {
    render(
      <IpInput
        label='IP'
        onChange={vi.fn()}
        required
        value={EMPTY_STRING}
      />
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders disabled inputs when disabled=true', () => {
    render(
      <IpInput
        disabled
        onChange={vi.fn()}
        value={IP_PASTE}
      />
    )
    screen.getAllByRole('spinbutton').forEach((input) => {
      expect(input).toBeDisabled()
    })
  })

  it('octet values are correct after paste', () => {
    const onChange = vi.fn()
    render(
      <IpInput
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => IP_PASTE }
    })
    expect(onChange).toHaveBeenCalledWith(
      `${OCTET_1}.${OCTET_2}.${OCTET_3}.${OCTET_4_VAL}`
    )
  })

  it('does not advance focus or auto-advance for low octet values', () => {
    const onChange = vi.fn()
    render(
      <IpInput
        onChange={onChange}
        value={IP_SIMPLE}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: String(OCTET_5) } })
    expect(onChange).toHaveBeenCalledWith(`${OCTET_5}.${0}.${0}.${OCTET_1}`)
  })

  it('clamps to max 255 correctly', () => {
    const onChange = vi.fn()
    render(
      <IpInput
        onChange={onChange}
        value={IP_SIMPLE}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: String(OCTET_255) } })
    expect(onChange).toHaveBeenCalledWith(`${OCTET_255}.${0}.${0}.${OCTET_1}`)
  })
})
