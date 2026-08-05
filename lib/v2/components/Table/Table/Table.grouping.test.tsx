import type { RowAction } from './rowActions'
import type { CellContext, ColumnDef } from '@tanstack/react-table'

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Table } from './Table'

interface Namespace {
  tenant: string
  nameSpace: string
  host: string
}

const GROUPING = ['tenant']
const TENANT_ALPHA = 'tenant-alpha'
const TENANT_BETA = 'tenant-beta'
const REMOVE_TENANT_ACTION = 'row-action-remove-tenant'

const COLUMNS: ColumnDef<Namespace>[] = [
  { accessorKey: 'tenant', header: 'Tenant' },
  { accessorKey: 'nameSpace', header: 'Namespace' },
  { accessorKey: 'host', header: 'Assigned host' }
]

const DATA: Namespace[] = [
  { tenant: TENANT_ALPHA, nameSpace: 'ns-1', host: 'host-1' },
  { tenant: TENANT_ALPHA, nameSpace: 'ns-2', host: 'host-2' },
  { tenant: TENANT_BETA, nameSpace: 'ns-3', host: 'host-3' }
]

const getGroupExpanders = () =>
  screen.getAllByRole('button', { name: /group$/i })

describe('Table grouping', () => {
  it('renders one collapsed row per group by default', () => {
    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        grouping={GROUPING}
      />
    )

    expect(screen.getByText(TENANT_ALPHA)).toBeInTheDocument()
    expect(screen.getByText(TENANT_BETA)).toBeInTheDocument()
    expect(screen.queryByText('ns-1')).not.toBeInTheDocument()
  })

  it('renders every leaf row when defaultExpandedGroups is set', () => {
    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        defaultExpandedGroups
        grouping={GROUPING}
      />
    )

    expect(screen.getByText('ns-1')).toBeInTheDocument()
    expect(screen.getByText('ns-3')).toBeInTheDocument()
  })

  it('reveals a group’s leaf rows when its expander is clicked', () => {
    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        grouping={GROUPING}
      />
    )

    fireEvent.click(getGroupExpanders()[0])

    expect(screen.getByText('ns-1')).toBeInTheDocument()
    expect(screen.getByText('ns-2')).toBeInTheDocument()
  })

  it('collapses an expanded group when its row is clicked', () => {
    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        defaultExpandedGroups
        grouping={GROUPING}
      />
    )

    fireEvent.click(screen.getByText(TENANT_ALPHA))

    expect(screen.queryByText('ns-1')).not.toBeInTheDocument()
    expect(screen.getByText('ns-3')).toBeInTheDocument()
  })

  it('rolls non-grouping columns up to a distinct value count', () => {
    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        grouping={GROUPING}
      />
    )

    expect(screen.getAllByText('2 (total)')).toHaveLength(2)
  })

  it('renders a column’s own aggregatedCell instead of the count', () => {
    const columnsWithAggregate: ColumnDef<Namespace>[] = [
      COLUMNS[0],
      {
        accessorKey: 'nameSpace',
        header: 'Namespace',
        aggregatedCell: ({ row }: CellContext<Namespace, unknown>) => (
          <span>{`${row.getLeafRows().length} namespaces`}</span>
        )
      },
      COLUMNS[2]
    ]

    render(
      <Table<Namespace>
        columns={columnsWithAggregate}
        data={DATA}
        grouping={GROUPING}
      />
    )

    expect(screen.getByText('2 namespaces')).toBeInTheDocument()
  })

  it('leaves the grouping column blank on leaf rows', () => {
    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        defaultExpandedGroups
        grouping={GROUPING}
      />
    )

    expect(screen.getAllByText(TENANT_ALPHA)).toHaveLength(1)
  })

  it('hands the grouped row to rowActions so group-only actions work', () => {
    const onRemove = vi.fn()
    const rowActions: RowAction<Namespace>[] = [
      {
        key: 'remove-tenant',
        text: 'Remove',
        hideAction: (_values, row) => !row.getIsGrouped(),
        action: (_values, row) => onRemove(row.getValue('tenant'))
      }
    ]

    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        grouping={GROUPING}
        rowActions={rowActions}
      />
    )

    fireEvent.click(screen.getAllByTestId('row-actions-button')[0])
    fireEvent.click(screen.getByTestId(REMOVE_TENANT_ACTION))

    expect(onRemove).toHaveBeenCalledWith(TENANT_ALPHA)
  })

  it('hides row actions on leaf rows when the action is group-only', () => {
    const rowActions: RowAction<Namespace>[] = [
      {
        key: 'remove-tenant',
        text: 'Remove',
        hideAction: (_values, row) => !row.getIsGrouped()
      }
    ]

    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        defaultExpandedGroups
        grouping={GROUPING}
        rowActions={rowActions}
      />
    )

    expect(screen.getAllByTestId('row-actions-button')).toHaveLength(2)
  })

  it('paginates over group rows rather than leaf rows', () => {
    render(
      <Table<Namespace>
        columns={COLUMNS}
        data={DATA}
        grouping={GROUPING}
        pageSize={1}
      />
    )

    expect(screen.getByText(TENANT_ALPHA)).toBeInTheDocument()
    expect(screen.queryByText(TENANT_BETA)).not.toBeInTheDocument()
  })
})
