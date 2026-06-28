import type {
  BooleanIconCellOptions,
  BooleanIconCellValue
} from './BooleanIconCell'
import type { CellContext } from '@tanstack/react-table'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EMPTY_CONTENT } from '#consts'

import { BooleanIconCell } from './BooleanIconCell'

interface TestRow {
  id: string
}

const SAMPLE_ROW: TestRow = { id: 'r1' }

function buildCellContext({
  value,
  cellOptions
}: {
  value: BooleanIconCellValue
  cellOptions?: BooleanIconCellOptions
}): CellContext<TestRow, BooleanIconCellValue> {
  return {
    cell: { getValue: () => value },
    row: { original: SAMPLE_ROW },
    column: { columnDef: { meta: { cellOptions } } }
  } as unknown as CellContext<TestRow, BooleanIconCellValue>
}

afterEach(() => {
  cleanup()
})

describe('BooleanIconCell - truthy value', () => {
  it('renders gradient check icon with default aria-label for true', () => {
    render(<BooleanIconCell {...buildCellContext({ value: true })} />)
    expect(screen.getByRole('img', { name: 'Yes' })).toBeInTheDocument()
  })

  it('renders gradient check icon with custom label when provided', () => {
    render(
      <BooleanIconCell
        {...buildCellContext({
          value: true,
          cellOptions: { label: 'Enabled' }
        })}
      />
    )
    expect(screen.getByRole('img', { name: 'Enabled' })).toBeInTheDocument()
  })
})

describe('BooleanIconCell - falsy value', () => {
  it('renders em-dash for false', () => {
    render(<BooleanIconCell {...buildCellContext({ value: false })} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText(EMPTY_CONTENT)).toBeInTheDocument()
  })

  it('renders em-dash for null', () => {
    render(<BooleanIconCell {...buildCellContext({ value: null })} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText(EMPTY_CONTENT)).toBeInTheDocument()
  })

  it('renders em-dash for undefined', () => {
    render(<BooleanIconCell {...buildCellContext({ value: undefined })} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText(EMPTY_CONTENT)).toBeInTheDocument()
  })
})
