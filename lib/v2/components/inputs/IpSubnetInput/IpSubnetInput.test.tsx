import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING, KEYBOARD_KEYS } from '#v2/utils/consts'

import { IpSubnetInput } from './IpSubnetInput'

const TOTAL_NUMBER_INPUTS = 5
const BITS_INPUT_INDEX = 4
const LAST_OCTET_INDEX = 3

// Test CIDRs — safe to hardcode in test files (sonarjs/no-hardcoded-ip)
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const SUBNET_BASIC = '10.0.0.0/16'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const SUBNET_DETAILED = '192.168.1.0/24'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const SUBNET_PASTE = '172.16.5.0/12'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const SUBNET_OCTET_CHANGED = '10.0.0.5/16'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const SUBNET_BITS_CHANGED = '10.0.0.0/24'
// eslint-disable-next-line sonarjs/no-hardcoded-ip
const SUBNET_BITS_CLAMPED = '10.0.0.0/32'

const OCTET_192 = 192
const OCTET_168 = 168
const OCTET_1 = 1
const OCTET_0 = 0
const OCTET_5 = 5
const BITS_24 = 24
const BITS_ABOVE_MAX = '99'

describe('IpSubnetInput', () => {
  it('renders 5 number inputs (4 octets + bits)', () => {
    render(
      <IpSubnetInput
        onChange={vi.fn()}
        value={SUBNET_BASIC}
      />
    )
    expect(screen.getAllByRole('spinbutton')).toHaveLength(TOTAL_NUMBER_INPUTS)
  })

  it('splits the value on the slash and populates octets and bits', () => {
    render(
      <IpSubnetInput
        onChange={vi.fn()}
        value={SUBNET_DETAILED}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    expect(inputs[0]).toHaveValue(OCTET_192)
    expect(inputs[1]).toHaveValue(OCTET_168)
    expect(inputs[2]).toHaveValue(OCTET_1)
    expect(inputs[3]).toHaveValue(OCTET_0)
    expect(inputs[BITS_INPUT_INDEX]).toHaveValue(BITS_24)
  })

  it('emits combined ip/bits string when an octet changes', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={SUBNET_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[3], { target: { value: String(OCTET_5) } })
    expect(onChange).toHaveBeenCalledWith(SUBNET_OCTET_CHANGED)
  })

  it('emits combined ip/bits string when bits change', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={SUBNET_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[BITS_INPUT_INDEX], {
      target: { value: String(BITS_24) }
    })
    expect(onChange).toHaveBeenCalledWith(SUBNET_BITS_CHANGED)
  })

  it('clamps bits to 0–32', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={SUBNET_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[BITS_INPUT_INDEX], {
      target: { value: BITS_ABOVE_MAX }
    })
    expect(onChange).toHaveBeenCalledWith(SUBNET_BITS_CLAMPED)
  })

  it('emits EMPTY_STRING when an octet becomes blank', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={SUBNET_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[0], { target: { value: EMPTY_STRING } })
    expect(onChange).toHaveBeenCalledWith(EMPTY_STRING)
  })

  it('emits EMPTY_STRING when bits become blank', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={SUBNET_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.change(inputs[BITS_INPUT_INDEX], {
      target: { value: EMPTY_STRING }
    })
    expect(onChange).toHaveBeenCalledWith(EMPTY_STRING)
  })

  it('distributes a pasted CIDR across octets and bits', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => SUBNET_PASTE }
    })
    expect(onChange).toHaveBeenCalledWith(SUBNET_PASTE)
  })

  it('accepts a CIDR pasted into the bits input', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.paste(inputs[BITS_INPUT_INDEX], {
      clipboardData: { getData: () => SUBNET_PASTE }
    })
    expect(onChange).toHaveBeenCalledWith(SUBNET_PASTE)
  })

  it('ignores pasted text that is not a CIDR', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetInput
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.paste(inputs[BITS_INPUT_INDEX], {
      clipboardData: { getData: () => 'not-a-cidr' }
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it.each(['/', '.', KEYBOARD_KEYS.ARROW_RIGHT])(
    'moves focus from the last octet to the bits input on "%s"',
    (key) => {
      render(
        <IpSubnetInput
          onChange={vi.fn()}
          value={SUBNET_BASIC}
        />
      )
      const inputs = screen.getAllByRole('spinbutton')
      fireEvent.keyDown(inputs[LAST_OCTET_INDEX], { key })
      expect(inputs[BITS_INPUT_INDEX]).toHaveFocus()
    }
  )

  it('moves focus from the bits input back to the last octet on ArrowLeft', () => {
    render(
      <IpSubnetInput
        onChange={vi.fn()}
        value={SUBNET_BASIC}
      />
    )
    const inputs = screen.getAllByRole('spinbutton')
    fireEvent.keyDown(inputs[BITS_INPUT_INDEX], {
      key: KEYBOARD_KEYS.ARROW_LEFT
    })
    expect(inputs[LAST_OCTET_INDEX]).toHaveFocus()
  })

  it('shows the label when provided', () => {
    render(
      <IpSubnetInput
        label='IP/BitMask'
        onChange={vi.fn()}
        value={EMPTY_STRING}
      />
    )
    expect(screen.getByText('IP/BitMask')).toBeInTheDocument()
  })

  it('shows required star when required=true and label is set', () => {
    render(
      <IpSubnetInput
        label='IP/BitMask'
        onChange={vi.fn()}
        required
        value={EMPTY_STRING}
      />
    )
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders disabled inputs when disabled=true', () => {
    render(
      <IpSubnetInput
        disabled
        onChange={vi.fn()}
        value={SUBNET_BASIC}
      />
    )
    screen.getAllByRole('spinbutton').forEach((input) => {
      expect(input).toBeDisabled()
    })
  })
})
