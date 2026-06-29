import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { UNIT_TYPES } from '#v2/utils/capacityUtils'

import { CapacityCell } from './CapacityCell'

const USED_BYTES = 2_000_000_000
const TOTAL_BYTES = 4_000_000_000
const USED_BINARY = 2_147_483_648
const TOTAL_BINARY = 4_294_967_296
const SOME_BYTES = 1_000_000_000

describe('CapacityCell', () => {
  it('renders used and total values with decimal units by default', () => {
    render(
      <CapacityCell
        total={TOTAL_BYTES}
        used={USED_BYTES}
      />
    )
    expect(screen.getAllByText('GB').length).toBeGreaterThan(0)
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders binary units when unitType is BASE2', () => {
    render(
      <CapacityCell
        total={TOTAL_BINARY}
        unitType={UNIT_TYPES.BASE2_AUTO}
        used={USED_BINARY}
      />
    )
    expect(screen.getAllByText('GiB').length).toBeGreaterThan(0)
  })

  it('shows "Unlimited" when total is 0 and unlimitedWhenZero is set', () => {
    render(
      <CapacityCell
        total={0}
        unlimitedWhenZero
        used={SOME_BYTES}
      />
    )
    expect(screen.getByText('Unlimited')).toBeInTheDocument()
  })

  it('renders the optional badge label when a badge is provided', () => {
    render(
      <CapacityCell
        badge={{ label: 'TP', tooltip: 'Thinly Provisioned' }}
        total={TOTAL_BYTES}
        used={USED_BYTES}
      />
    )
    expect(screen.getByText('TP')).toBeInTheDocument()
  })

  it('renders no badge by default', () => {
    render(
      <CapacityCell
        total={TOTAL_BYTES}
        used={USED_BYTES}
      />
    )
    expect(screen.queryByText('TP')).not.toBeInTheDocument()
  })
})
