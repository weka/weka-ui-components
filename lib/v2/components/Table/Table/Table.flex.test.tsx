import type { ColumnDef } from '@tanstack/react-table'

import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_STRING } from '#consts'

import { Table } from './Table'

interface Row {
  id: number
  name: string
  value: string
}

const DATA: Row[] = [{ id: 1, name: 'a', value: 'x' }]

const COLUMNS: ColumnDef<Row>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    meta: { flex: true } as ColumnDef<Row>['meta']
  },
  { id: 'value', accessorKey: 'value', header: 'Value', size: 150 }
]

const ROW_ACTIONS = [{ key: 'edit', text: 'Edit', action: vi.fn() }]

describe('Table — flex column', () => {
  it('omits the width on a flex column (header + body) while fixed columns keep their width', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowActions={ROW_ACTIONS}
      />
    )

    const flexHeader = container.querySelector<HTMLElement>(
      '[data-testid="column-header-name"]'
    )
    const fixedHeader = container.querySelector<HTMLElement>(
      '[data-testid="column-header-value"]'
    )
    expect(flexHeader?.style.width).toBe(EMPTY_STRING)
    expect(fixedHeader?.style.width).not.toBe(EMPTY_STRING)

    const bodyCells = container.querySelectorAll<HTMLElement>('tbody tr td')
    expect(bodyCells[0]?.style.width).toBe(EMPTY_STRING)
    expect(bodyCells[1]?.style.width).not.toBe(EMPTY_STRING)
  })

  it('auto-flexes the last data column when row actions exist and no column opts into flex', () => {
    const plainColumns: ColumnDef<Row>[] = [
      { id: 'name', accessorKey: 'name', header: 'Name', size: 200 },
      { id: 'value', accessorKey: 'value', header: 'Value', size: 150 }
    ]

    const { container } = render(
      <Table
        columns={plainColumns}
        data={DATA}
        dataTestId='fs-body-table'
        rowActions={ROW_ACTIONS}
      />
    )

    const nameHeader = container.querySelector<HTMLElement>(
      '[data-testid="column-header-name"]'
    )
    const valueHeader = container.querySelector<HTMLElement>(
      '[data-testid="column-header-value"]'
    )
    expect(nameHeader?.style.width).not.toBe(EMPTY_STRING)
    expect(valueHeader?.style.width).toBe(EMPTY_STRING)

    const bodyTable = container.querySelector<HTMLElement>(
      '[data-testid="fs-body-table"]'
    )
    expect(bodyTable?.style.minWidth).not.toBe(EMPTY_STRING)
  })
})
