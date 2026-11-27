import type { ColumnDef } from '@tanstack/react-table'

import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Table } from './Table'

interface Item {
  name: string
  region: string
  status: string
  owner: string
}

const COLUMN_WIDTH = 100

const COLUMNS: ColumnDef<Item>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'owner', header: 'Owner' }
]

const DATA: Item[] = [
  { name: 'fs-1', region: 'us', status: 'ok', owner: 'root' }
]

const LOCK_FIRST_AND_LAST = { lockedStart: 1, lockedEnd: 1 }

const getHeaderOrder = () =>
  Array.from(document.querySelectorAll('thead th')).map((cell) =>
    cell.getAttribute('data-column-id')
  )

const getHeader = (columnId: string) =>
  screen.getByTestId(`column-header-${columnId}`)

const columnCenterX = (columnId: string) =>
  getHeaderOrder().indexOf(columnId) * COLUMN_WIDTH + COLUMN_WIDTH / 2

const dragHeader = (fromId: string, toId: string) => {
  const startX = columnCenterX(fromId)
  const endX = columnCenterX(toId)
  fireEvent.mouseDown(getHeader(fromId), { button: 0, clientX: startX })
  fireEvent.mouseMove(window, { clientX: endX })
  fireEvent.mouseUp(window, { clientX: endX })
}

describe('Table column reorder', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getRect(this: HTMLElement) {
        const index = this.parentElement
          ? Array.from(this.parentElement.children).indexOf(this)
          : 0
        const left = index * COLUMN_WIDTH
        return { left, right: left + COLUMN_WIDTH } as DOMRect
      }
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not make headers draggable by default', () => {
    const onColumnOrderChange = vi.fn()
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        onColumnOrderChange={onColumnOrderChange}
      />
    )

    dragHeader('region', 'status')

    expect(getHeaderOrder()).toEqual(['name', 'region', 'status', 'owner'])
    expect(onColumnOrderChange).not.toHaveBeenCalled()
  })

  it('moves a column on drop and reports the new order once', () => {
    const onColumnOrderChange = vi.fn()
    render(
      <Table
        columnReorder={LOCK_FIRST_AND_LAST}
        columns={COLUMNS}
        data={DATA}
        onColumnOrderChange={onColumnOrderChange}
      />
    )

    dragHeader('region', 'status')

    const expectedOrder = ['name', 'status', 'region', 'owner']
    expect(getHeaderOrder()).toEqual(expectedOrder)
    expect(onColumnOrderChange).toHaveBeenCalledTimes(1)
    expect(onColumnOrderChange).toHaveBeenCalledWith(expectedOrder)
  })

  it('does not move a column past a locked one', () => {
    render(
      <Table
        columnReorder={LOCK_FIRST_AND_LAST}
        columns={COLUMNS}
        data={DATA}
      />
    )

    dragHeader('status', 'owner')
    dragHeader('region', 'name')

    expect(getHeaderOrder()).toEqual(['name', 'region', 'status', 'owner'])
  })

  it('marks only movable headers', () => {
    render(
      <Table
        columnReorder={LOCK_FIRST_AND_LAST}
        columns={COLUMNS}
        data={DATA}
      />
    )

    const movableClass = getHeader('region').className
    expect(getHeader('name').className).not.toBe(movableClass)
    expect(getHeader('owner').className).not.toBe(movableClass)
    expect(getHeader('status').className).toBe(movableClass)
  })

  it('locks the first column when it is pinned', () => {
    render(
      <Table
        columnReorder={{}}
        columns={COLUMNS}
        data={DATA}
        pinFirstColumn
      />
    )

    dragHeader('name', 'region')

    expect(getHeaderOrder()[0]).toBe('name')
  })

  it('renders the initial order, keeping locked columns in place', () => {
    render(
      <Table
        columnReorder={LOCK_FIRST_AND_LAST}
        columns={COLUMNS}
        data={DATA}
        initialColumnOrder={['owner', 'status', 'name', 'region']}
      />
    )

    expect(getHeaderOrder()).toEqual(['name', 'status', 'region', 'owner'])
  })

  it('does not toggle sorting when the drag ends on the label', () => {
    const onExternalSortingChange = vi.fn()
    render(
      <Table
        columnReorder={LOCK_FIRST_AND_LAST}
        columns={COLUMNS}
        data={DATA}
        onExternalSortingChange={onExternalSortingChange}
      />
    )
    onExternalSortingChange.mockClear()

    const label = screen.getByRole('button', { name: 'Region' })
    fireEvent.mouseDown(label, { button: 0, clientX: columnCenterX('region') })
    fireEvent.mouseMove(window, { clientX: columnCenterX('status') })
    fireEvent.mouseUp(window)
    fireEvent.click(label)

    expect(onExternalSortingChange).not.toHaveBeenCalled()
  })

  it('restores definition order on reset to defaults', () => {
    render(
      <Table
        columnReorder={LOCK_FIRST_AND_LAST}
        columns={COLUMNS}
        data={DATA}
        initialColumnOrder={['name', 'status', 'region', 'owner']}
        onResetToDefaults={vi.fn()}
      />
    )

    fireEvent.click(screen.getByTestId('table-settings-button'))
    fireEvent.click(screen.getByTestId('table-settings-reset-defaults'))

    expect(getHeaderOrder()).toEqual(['name', 'region', 'status', 'owner'])
  })

  it('still sorts on a plain click of a movable header', () => {
    const onExternalSortingChange = vi.fn()
    render(
      <Table
        columnReorder={LOCK_FIRST_AND_LAST}
        columns={COLUMNS}
        data={DATA}
        onExternalSortingChange={onExternalSortingChange}
      />
    )
    onExternalSortingChange.mockClear()

    const label = screen.getByRole('button', { name: 'Region' })
    fireEvent.mouseDown(label, { button: 0, clientX: columnCenterX('region') })
    fireEvent.mouseUp(window)
    fireEvent.click(label)

    expect(onExternalSortingChange).toHaveBeenCalledWith([
      { id: 'region', desc: false }
    ])
  })
})
