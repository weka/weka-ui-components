import type { StatusCellOptions } from './StatusCell'
import type { StatusCellValue } from './statusUtils'
import type { CellContext } from '@tanstack/react-table'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { StatusCell } from './StatusCell'
import {
  DEGRADED_STATUSES,
  getStatusVariant,
  STATUS_VARIANTS,
  UP_STATUSES,
  WORKING_STATUSES
} from './statusUtils'

interface TestRow {
  id: string
}

const SAMPLE_ROW: TestRow = { id: 'r1' }

function buildCellContext({
  value,
  cellOptions
}: {
  value: StatusCellValue
  cellOptions?: StatusCellOptions
}): CellContext<TestRow, StatusCellValue> {
  return {
    cell: { getValue: () => value },
    row: { original: SAMPLE_ROW },
    column: { columnDef: { meta: { cellOptions } } }
  } as unknown as CellContext<TestRow, StatusCellValue>
}

afterEach(() => {
  cleanup()
})

describe('getStatusVariant - direct unit tests', () => {
  it('returns DOWN for null', () => {
    expect(getStatusVariant(null)).toBe(STATUS_VARIANTS.DOWN)
  })

  it('returns DOWN for undefined', () => {
    expect(getStatusVariant(undefined)).toBe(STATUS_VARIANTS.DOWN)
  })

  it('returns DOWN for empty string', () => {
    expect(getStatusVariant(EMPTY_STRING)).toBe(STATUS_VARIANTS.DOWN)
  })

  it('returns UP for known up statuses', () => {
    for (const status of UP_STATUSES) {
      expect(getStatusVariant(status)).toBe(STATUS_VARIANTS.UP)
    }
  })

  it('returns WORKING for known working statuses', () => {
    for (const status of WORKING_STATUSES) {
      expect(getStatusVariant(status)).toBe(STATUS_VARIANTS.WORKING)
    }
  })

  it('returns DEGRADED for known degraded statuses', () => {
    for (const status of DEGRADED_STATUSES) {
      expect(getStatusVariant(status)).toBe(STATUS_VARIANTS.DEGRADED)
    }
  })

  it('normalizes lowercase input to uppercase before classification', () => {
    expect(getStatusVariant('up')).toBe(STATUS_VARIANTS.UP)
    expect(getStatusVariant('creating')).toBe(STATUS_VARIANTS.WORKING)
    expect(getStatusVariant('degraded')).toBe(STATUS_VARIANTS.DEGRADED)
  })

  it('returns DOWN for unknown status', () => {
    expect(getStatusVariant('UNKNOWN_STATE')).toBe(STATUS_VARIANTS.DOWN)
  })

  it('uses custom sets when provided', () => {
    const customUp = new Set(['ONLINE'])
    expect(getStatusVariant('ONLINE', { up: customUp })).toBe(
      STATUS_VARIANTS.UP
    )
    expect(getStatusVariant('UP', { up: customUp })).toBe(STATUS_VARIANTS.DOWN)
  })
})

describe('StatusCell - renders correct visual per variant', () => {
  it('renders check icon for UP status', () => {
    render(<StatusCell {...buildCellContext({ value: 'UP' })} />)
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders spinner for WORKING status', () => {
    const { container } = render(
      <StatusCell {...buildCellContext({ value: 'CREATING' })} />
    )
    expect(container.querySelector('.statusSpinner')).toBeInTheDocument()
  })

  it('renders degraded dot for DEGRADED status', () => {
    const { container } = render(
      <StatusCell {...buildCellContext({ value: 'DEGRADED' })} />
    )
    const dot = container.querySelector('.statusDotDegraded')
    expect(dot).toBeInTheDocument()
  })

  it('renders down dot for unknown status', () => {
    const { container } = render(
      <StatusCell {...buildCellContext({ value: 'OFFLINE' })} />
    )
    const dot = container.querySelector('.statusDotDown')
    expect(dot).toBeInTheDocument()
  })

  it('applies custom classify option', () => {
    const { container } = render(
      <StatusCell
        {...buildCellContext({
          value: 'ONLINE',
          cellOptions: { classify: () => STATUS_VARIANTS.UP }
        })}
      />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('formats label using formatLabel option', () => {
    render(
      <StatusCell
        {...buildCellContext({
          value: 'PHASING_IN',
          cellOptions: { formatLabel: (s) => s.toLowerCase().replace('_', ' ') }
        })}
      />
    )
    expect(screen.getByLabelText('phasing in')).toBeInTheDocument()
  })

  it('replaces underscores with spaces in default label', () => {
    render(<StatusCell {...buildCellContext({ value: 'PHASING_OUT' })} />)
    expect(screen.getByLabelText('PHASING OUT')).toBeInTheDocument()
  })
})
