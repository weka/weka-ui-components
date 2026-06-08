import type { DefaultCellOptions, DefaultCellValue } from './DefaultCell'
import type { CellContext } from '@tanstack/react-table'

import { MemoryRouter } from 'react-router-dom'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { DefaultCell } from './DefaultCell'

interface TestRow {
  id: string
  label: string
}

const ROW_LABEL = 'row-label'
const SAMPLE_ROW: TestRow = { id: 'r1', label: ROW_LABEL }
const SAMPLE_URL = '/details/r1'

function buildCellContext({
  value,
  cellOptions
}: {
  value: DefaultCellValue
  cellOptions?: DefaultCellOptions<TestRow>
}): CellContext<TestRow, DefaultCellValue> {
  return {
    cell: { getValue: () => value },
    row: { original: SAMPLE_ROW },
    column: { columnDef: { meta: { cellOptions } } }
  } as unknown as CellContext<TestRow, DefaultCellValue>
}

function renderCell(ctx: CellContext<TestRow, DefaultCellValue>) {
  return render(
    <MemoryRouter>
      <DefaultCell {...ctx} />
    </MemoryRouter>
  )
}

afterEach(() => {
  cleanup()
})

describe('DefaultCell - value formatting', () => {
  it('renders a string value', () => {
    renderCell(buildCellContext({ value: 'hello world' }))
    expect(screen.getByText('hello world')).toBeInTheDocument()
  })

  it('renders a number value as text', () => {
    renderCell(buildCellContext({ value: 42 }))
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('joins an array value with comma separator', () => {
    renderCell(buildCellContext({ value: ['alpha', 'beta', 'gamma'] }))
    expect(screen.getByText('alpha, beta, gamma')).toBeInTheDocument()
  })

  it('renders empty for null', () => {
    const { container } = renderCell(buildCellContext({ value: null }))
    expect(container.textContent).toBe(EMPTY_STRING)
  })

  it('renders empty for undefined', () => {
    const { container } = renderCell(buildCellContext({ value: undefined }))
    expect(container.textContent).toBe(EMPTY_STRING)
  })
})

describe('DefaultCell - link rendering', () => {
  it('renders content wrapped in a Link when getUrl is provided', () => {
    const ctx = buildCellContext({
      value: 'click me',
      cellOptions: { getUrl: (row) => `/items/${row.id}` }
    })
    renderCell(ctx)

    const link = screen.getByRole('link', { name: 'click me' })
    expect(link).toHaveAttribute('href', '/items/r1')
  })

  it('does not render a Link when getUrl is not provided', () => {
    renderCell(buildCellContext({ value: 'no link' }))
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('adds new-tab attributes only when openInNewTab is set', () => {
    const ctx = buildCellContext({
      value: 'go',
      cellOptions: { getUrl: () => SAMPLE_URL, openInNewTab: true }
    })
    renderCell(ctx)

    const link = screen.getByRole('link', { name: 'go' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('omits new-tab attributes when openInNewTab is false', () => {
    const ctx = buildCellContext({
      value: 'go',
      cellOptions: { getUrl: () => SAMPLE_URL }
    })
    renderCell(ctx)

    const link = screen.getByRole('link', { name: 'go' })
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })

  it('stops click propagation on the Link', () => {
    const onParentClick = vi.fn()
    const ctx = buildCellContext({
      value: 'click',
      cellOptions: { getUrl: () => SAMPLE_URL }
    })
    render(
      <MemoryRouter>
        <div onClick={onParentClick}>
          <DefaultCell {...ctx} />
        </div>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('link', { name: 'click' }))
    expect(onParentClick).not.toHaveBeenCalled()
  })
})

describe('DefaultCell - custom tooltip', () => {
  it('exposes string tooltipText via aria-label on the wrapper', () => {
    const TOOLTIP_BODY = 'custom tooltip body'
    const ctx = buildCellContext({
      value: 'shown text',
      cellOptions: { tooltipText: TOOLTIP_BODY }
    })
    renderCell(ctx)

    expect(screen.getByText('shown text')).toBeInTheDocument()
    expect(screen.getByLabelText(TOOLTIP_BODY)).toBeInTheDocument()
  })

  it('calls function tooltipText with the cell props', () => {
    const tooltipFn = vi.fn(() => 'function tooltip')
    const ctx = buildCellContext({
      value: 'cell',
      cellOptions: { tooltipText: tooltipFn }
    })
    renderCell(ctx)

    expect(tooltipFn).toHaveBeenCalledWith(ctx)
  })
})
