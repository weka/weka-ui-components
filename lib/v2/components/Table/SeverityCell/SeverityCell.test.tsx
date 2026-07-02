import type { CellContext } from '@tanstack/react-table'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { SEVERITY_TYPES } from '#v2/utils/consts'

import { SeverityCell } from './SeverityCell'

interface TestRow {
  id: string
}

const SAMPLE_ROW: TestRow = { id: 'r1' }

function buildCellContext(value: string): CellContext<TestRow, string> {
  return {
    cell: { getValue: () => value },
    row: { original: SAMPLE_ROW },
    column: { columnDef: {} }
  } as unknown as CellContext<TestRow, string>
}

afterEach(() => {
  cleanup()
})

describe('SeverityCell', () => {
  it('renders the severity label from the cell value', () => {
    render(<SeverityCell {...buildCellContext(SEVERITY_TYPES.CRITICAL)} />)
    expect(screen.getByText(SEVERITY_TYPES.CRITICAL)).toBeInTheDocument()
  })

  it('renders each severity value', () => {
    for (const severity of [
      SEVERITY_TYPES.MAJOR,
      SEVERITY_TYPES.MINOR,
      SEVERITY_TYPES.WARNING,
      SEVERITY_TYPES.INFO
    ]) {
      cleanup()
      render(<SeverityCell {...buildCellContext(severity)} />)
      expect(screen.getByText(severity)).toBeInTheDocument()
    }
  })
})
