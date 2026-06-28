import type { ProgressCellOptions, ProgressCellValue } from './ProgressCell'
import type { CellContext } from '@tanstack/react-table'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { EMPTY_CONTENT } from '#consts'

import { CAPACITY_FILL_COLORS } from '../../CapacityProgressBar'
import { ProgressCell } from './ProgressCell'

interface TestRow {
  id: string
}

const SAMPLE_ROW: TestRow = { id: 'r1' }

function buildCellContext({
  value,
  cellOptions
}: {
  value: ProgressCellValue
  cellOptions?: ProgressCellOptions<TestRow>
}): CellContext<TestRow, ProgressCellValue> {
  return {
    cell: { getValue: () => value },
    row: { original: SAMPLE_ROW },
    column: { columnDef: { meta: { cellOptions } } }
  } as unknown as CellContext<TestRow, ProgressCellValue>
}

afterEach(() => {
  cleanup()
})

describe('ProgressCell - empty values', () => {
  it('renders dash for null', () => {
    render(<ProgressCell {...buildCellContext({ value: null })} />)
    expect(screen.getByText(EMPTY_CONTENT)).toBeInTheDocument()
  })

  it('renders dash for undefined', () => {
    render(<ProgressCell {...buildCellContext({ value: undefined })} />)
    expect(screen.getByText(EMPTY_CONTENT)).toBeInTheDocument()
  })
})

describe('ProgressCell - renders bar', () => {
  it('renders progress bar container for a valid percentage', () => {
    const { container } = render(
      <ProgressCell {...buildCellContext({ value: 50 })} />
    )
    expect(container.querySelector('.progressCell')).toBeInTheDocument()
    expect(container.querySelector('.progressBar')).toBeInTheDocument()
  })

  it('shows percentage text in the bar', () => {
    render(<ProgressCell {...buildCellContext({ value: 50 })} />)
    expect(screen.getByText('50.0%')).toBeInTheDocument()
  })

  it('applies custom fillColor from meta', () => {
    const { container } = render(
      <ProgressCell
        {...buildCellContext({
          value: 80,
          cellOptions: { fillColor: CAPACITY_FILL_COLORS.ORANGE }
        })}
      />
    )
    const fill = container.querySelector('.fillOrange')
    expect(fill).toBeInTheDocument()
  })

  it('applies custom minWidth as inline style', () => {
    const { container } = render(
      <ProgressCell
        {...buildCellContext({
          value: 60,
          cellOptions: { minWidth: 200 }
        })}
      />
    )
    const cell = container.querySelector('.progressCell') as HTMLElement | null
    expect(cell?.style.minWidth).toBe('200px')
  })

  it('renders tooltip wrapper when tooltip string is provided', () => {
    render(
      <ProgressCell
        {...buildCellContext({
          value: 75,
          cellOptions: { tooltip: 'Used: 75%' }
        })}
      />
    )
    expect(screen.getByLabelText('Used: 75%')).toBeInTheDocument()
  })

  it('does not render tooltip wrapper when no tooltip provided', () => {
    render(<ProgressCell {...buildCellContext({ value: 30 })} />)
    expect(screen.queryByLabelText(/.+/)).not.toBeInTheDocument()
  })

  it('renders tooltip wrapper when tooltip is a function', () => {
    render(
      <ProgressCell
        {...buildCellContext({
          value: 40,
          cellOptions: {
            tooltip: (cellCtx) => `Row: ${cellCtx.row.original.id}`
          }
        })}
      />
    )
    expect(screen.getByLabelText('Row: r1')).toBeInTheDocument()
  })
})
