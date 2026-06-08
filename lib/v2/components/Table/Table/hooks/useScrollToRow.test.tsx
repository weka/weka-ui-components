import type { ColumnDef, TableOptions } from '@tanstack/react-table'

import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { NOOP } from '#v2/utils/consts'

import { useScrollToRow } from './useScrollToRow'

interface Row {
  id: string
}

const DATA: Row[] = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
const COLUMNS: ColumnDef<Row>[] = [{ accessorKey: 'id' }]
const PAGE_SIZE = 1
const SCROLL_DELAY_MS = 100
const EXPECTED_TARGET_PAGE = 3

interface HarnessProps {
  scrollToRowId: string | null
  manualPagination?: boolean
  setInternalCurrentPage?: (page: number) => void
}

function Harness({
  scrollToRowId,
  manualPagination = false,
  setInternalCurrentPage = NOOP
}: Readonly<HarnessProps>) {
  const table = useReactTable({
    data: DATA,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel()
  } as TableOptions<Row>)

  useScrollToRow({
    scrollToRowId,
    manualPagination,
    table,
    getRowId: (row: Row) => row.id,
    effectivePageSize: PAGE_SIZE,
    currentPage: 1,
    setInternalCurrentPage,
    data: DATA
  })

  return (
    <div>
      {DATA.map((row) => (
        <div
          key={row.id}
          data-row-id={row.id}
        >
          {row.id}
        </div>
      ))}
    </div>
  )
}

let scrollIntoViewMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.useFakeTimers()
  scrollIntoViewMock = vi.fn()
  Element.prototype.scrollIntoView =
    scrollIntoViewMock as unknown as typeof Element.prototype.scrollIntoView
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('useScrollToRow', () => {
  it('scrolls the matching row into view once it mounts', () => {
    render(<Harness scrollToRowId='b' />)

    vi.advanceTimersByTime(SCROLL_DELAY_MS)

    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  it('pages to the target row under client-side pagination', () => {
    const setInternalCurrentPage = vi.fn()
    render(
      <Harness
        scrollToRowId='c'
        setInternalCurrentPage={setInternalCurrentPage}
      />
    )

    expect(setInternalCurrentPage).toHaveBeenCalledWith(EXPECTED_TARGET_PAGE)
  })

  it('does not page under manual pagination but still scrolls', () => {
    const setInternalCurrentPage = vi.fn()
    render(
      <Harness
        manualPagination
        scrollToRowId='c'
        setInternalCurrentPage={setInternalCurrentPage}
      />
    )

    expect(setInternalCurrentPage).not.toHaveBeenCalled()

    vi.advanceTimersByTime(SCROLL_DELAY_MS)
    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  it('does nothing when there is no target row', () => {
    const setInternalCurrentPage = vi.fn()
    render(
      <Harness
        scrollToRowId={null}
        setInternalCurrentPage={setInternalCurrentPage}
      />
    )

    vi.advanceTimersByTime(SCROLL_DELAY_MS)

    expect(scrollIntoViewMock).not.toHaveBeenCalled()
    expect(setInternalCurrentPage).not.toHaveBeenCalled()
  })
})
