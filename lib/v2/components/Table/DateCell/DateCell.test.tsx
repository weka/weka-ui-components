import type { DateCellOptions, DateCellValue } from './DateCell'
import type { CellContext } from '@tanstack/react-table'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { NOT_APPLICABLE } from '#v2/utils/consts'
import { formatTimestamp, toDateTime } from '#v2/utils/timeUtils'

import { DateCell } from './DateCell'

interface TestRow {
  id: string
}

const SAMPLE_ROW: TestRow = { id: 'r1' }

function buildCellContext({
  value,
  cellOptions
}: {
  value: DateCellValue
  cellOptions?: DateCellOptions
}): CellContext<TestRow, DateCellValue> {
  return {
    cell: { getValue: () => value },
    row: { original: SAMPLE_ROW },
    column: { columnDef: { meta: { cellOptions } } }
  } as unknown as CellContext<TestRow, DateCellValue>
}

afterEach(() => {
  cleanup()
})

describe('DateCell - empty/invalid values', () => {
  it('renders N/A for null', () => {
    render(<DateCell {...buildCellContext({ value: null })} />)
    expect(screen.getByText(NOT_APPLICABLE)).toBeInTheDocument()
  })

  it('renders N/A for undefined', () => {
    render(<DateCell {...buildCellContext({ value: undefined })} />)
    expect(screen.getByText(NOT_APPLICABLE)).toBeInTheDocument()
  })

  it('renders N/A for an invalid date string', () => {
    render(<DateCell {...buildCellContext({ value: 'not-a-date' })} />)
    expect(screen.getByText(NOT_APPLICABLE)).toBeInTheDocument()
  })
})

describe('DateCell - valid date formatting', () => {
  const ISO_STRING = '2024-03-15T14:30:45.000Z'
  const EPOCH_MS = 1710512245000

  it('default format (string input) matches formatTimestamp output', () => {
    render(<DateCell {...buildCellContext({ value: ISO_STRING })} />)
    expect(screen.getByText(formatTimestamp(ISO_STRING))).toBeInTheDocument()
  })

  it('default format (numeric epoch ms) matches formatTimestamp output', () => {
    render(<DateCell {...buildCellContext({ value: EPOCH_MS })} />)
    expect(screen.getByText(formatTimestamp(EPOCH_MS))).toBeInTheDocument()
  })

  it('custom format string is applied via toDateTime().toFormat()', () => {
    const expected = toDateTime(ISO_STRING)!.toFormat('yyyy-MM-dd')
    render(
      <DateCell
        {...buildCellContext({
          value: ISO_STRING,
          cellOptions: { format: 'yyyy-MM-dd' }
        })}
      />
    )
    expect(screen.getByText(expected)).toBeInTheDocument()
  })
})
