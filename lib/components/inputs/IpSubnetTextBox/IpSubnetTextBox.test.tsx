import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import IpSubnetTextBox from './IpSubnetTextBox'

const LABEL = 'Subnet'
const FIXED_PREFIX = 24
// eslint-disable-next-line sonarjs/no-hardcoded-ip -- subnet mask test fixture
const FIXED_MASK = '255.255.255.0'
const IP_PARTS = ['10', '0', '0', '1']
const PREFIX_INPUT_INDEX = 4
const PARTIAL_VALUE_WITH_PREFIX = `.../${FIXED_PREFIX}`

function getInputs() {
  return screen.getAllByRole('spinbutton') as HTMLInputElement[]
}

describe('IpSubnetTextBox', () => {
  it('shows a fixed subnet as its prefix length', () => {
    render(
      <IpSubnetTextBox
        fixedSubnet={FIXED_PREFIX}
        label={LABEL}
        onChange={vi.fn()}
        value={EMPTY_STRING}
      />
    )

    expect(getInputs()[PREFIX_INPUT_INDEX]).toHaveValue(FIXED_PREFIX)
  })

  it('emits the mask for a fixed subnet once the IP is complete', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetTextBox
        fixedSubnet={FIXED_PREFIX}
        label={LABEL}
        onChange={onChange}
        value={EMPTY_STRING}
      />
    )

    IP_PARTS.forEach((part, index) => {
      fireEvent.change(getInputs()[index], { target: { value: part } })
    })

    expect(onChange).toHaveBeenLastCalledWith(
      `${IP_PARTS.join('.')}/${FIXED_MASK}`
    )
  })

  it('keeps a fixed subnet when remounted with a partial value', () => {
    const onChange = vi.fn()
    render(
      <IpSubnetTextBox
        fixedSubnet={FIXED_PREFIX}
        label={LABEL}
        onChange={onChange}
        value={PARTIAL_VALUE_WITH_PREFIX}
      />
    )

    expect(getInputs()[PREFIX_INPUT_INDEX]).toHaveValue(FIXED_PREFIX)

    IP_PARTS.forEach((part, index) => {
      fireEvent.change(getInputs()[index], { target: { value: part } })
    })

    expect(onChange).toHaveBeenLastCalledWith(
      `${IP_PARTS.join('.')}/${FIXED_MASK}`
    )
  })

  it('shows the prefix length of a mask from the value', () => {
    render(
      <IpSubnetTextBox
        label={LABEL}
        onChange={vi.fn()}
        value={`${IP_PARTS.join('.')}/${FIXED_MASK}`}
      />
    )

    expect(getInputs()[PREFIX_INPUT_INDEX]).toHaveValue(FIXED_PREFIX)
  })
})
