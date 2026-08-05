import type { CellContext, Row } from '@tanstack/react-table'

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { AggregatedCountCell } from './AggregatedCountCell'

interface Namespace {
  nameSpace: string
}

const COLUMN_ID = 'nameSpace'

function buildCellContext(
  leafValues: string[]
): CellContext<Namespace, unknown> {
  const leafRows = leafValues.map(
    (nameSpace) =>
      ({
        original: { nameSpace },
        getValue: () => nameSpace
      }) as unknown as Row<Namespace>
  )

  return {
    row: { getLeafRows: () => leafRows },
    column: { id: COLUMN_ID }
  } as unknown as CellContext<Namespace, unknown>
}

const renderCell = (leafValues: string[]) =>
  render(<AggregatedCountCell {...buildCellContext(leafValues)} />)

describe('AggregatedCountCell', () => {
  it('renders the number of distinct leaf values', () => {
    renderCell(['ns-1', 'ns-2', 'ns-3'])
    expect(screen.getByText('3 (total)')).toBeInTheDocument()
  })

  it('counts repeated leaf values once', () => {
    renderCell(['ns-1', 'ns-1', 'ns-2'])
    expect(screen.getByText('2 (total)')).toBeInTheDocument()
  })

  it('renders zero when every leaf value is empty', () => {
    renderCell([EMPTY_STRING, EMPTY_STRING])
    expect(screen.getByText('0 (total)')).toBeInTheDocument()
  })
})
