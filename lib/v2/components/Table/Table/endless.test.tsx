import type { ColumnDef } from '@tanstack/react-table'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Table } from './Table'

interface Item {
  id: number
  name: string
}

const COLUMNS: ColumnDef<Item>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'name', accessorKey: 'name', header: 'Name' }
]

const SMALL_SET = 5
const MEDIUM_SET = 30
const LARGE_SET = 50
const SMALL_PAGE_SIZE = 10
const makeData = (count: number): Item[] =>
  Array.from({ length: count }, (_unused, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`
  }))

/**
 * Minimal IntersectionObserver stub that can be used with `new`.
 * Captures the latest callback so tests can invoke it directly to simulate
 * intersection events without a real browser layout engine.
 */
type IOHandler = (entries: IntersectionObserverEntry[]) => void

let observerCallback: IOHandler | null = null

class FakeIntersectionObserver {
  constructor(handler: IOHandler) {
    observerCallback = handler
  }

  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

const triggerIntersection = (isIntersecting: boolean) => {
  observerCallback?.([{ isIntersecting } as IntersectionObserverEntry])
}

interface LoadMoreOverrides {
  endless?: boolean
  hasMore?: boolean
  isLoadingMore?: boolean
  loading?: boolean
  rowCount?: number
}

const endlessTable = (
  onLoadMore: () => void,
  { rowCount = SMALL_SET, ...overrides }: LoadMoreOverrides = {}
) => (
  <Table
    columns={COLUMNS}
    data={makeData(rowCount)}
    endless
    hasMore
    isLoadingMore={false}
    onLoadMore={onLoadMore}
    {...overrides}
  />
)

const renderForLoadMore = (
  onLoadMore: () => void,
  overrides: LoadMoreOverrides = {}
) => render(endlessTable(onLoadMore, overrides))

beforeEach(() => {
  observerCallback = null
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Table endless-scroll mode', () => {
  describe('row rendering', () => {
    it('renders all rows without pagination slicing when endless is true', () => {
      const data = makeData(MEDIUM_SET)
      render(
        <Table
          columns={COLUMNS}
          data={data}
          endless
          pageSize={SMALL_PAGE_SIZE}
        />
      )
      expect(screen.getByText(`Item ${MEDIUM_SET}`)).toBeInTheDocument()
      expect(screen.getByText('Item 1')).toBeInTheDocument()
    })

    it('respects pagination (does NOT show page-2 rows) when endless is false', () => {
      const data = makeData(MEDIUM_SET)
      render(
        <Table
          columns={COLUMNS}
          data={data}
          pageSize={SMALL_PAGE_SIZE}
        />
      )
      expect(
        screen.queryByText(`Item ${SMALL_PAGE_SIZE + 1}`)
      ).not.toBeInTheDocument()
    })
  })

  describe('pagination footer', () => {
    it('does not render Pagination when endless is true and there are many rows', () => {
      const data = makeData(LARGE_SET)
      const { container } = render(
        <Table
          columns={COLUMNS}
          data={data}
          endless
          pageSize={SMALL_PAGE_SIZE}
        />
      )
      const footer = container.querySelector('.tableFooter')
      const pageButtons = footer?.querySelectorAll('button')
      expect(pageButtons?.length).toBe(0)
    })
  })

  describe('IntersectionObserver — onLoadMore', () => {
    it('calls onLoadMore when sentinel intersects with hasMore=true and not loading', () => {
      const onLoadMore = vi.fn()
      renderForLoadMore(onLoadMore)
      triggerIntersection(true)
      expect(onLoadMore).toHaveBeenCalledTimes(1)
    })

    it('does not call onLoadMore when hasMore is false', () => {
      const onLoadMore = vi.fn()
      renderForLoadMore(onLoadMore, { hasMore: false })
      triggerIntersection(true)
      expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('does not call onLoadMore while the initial query is loading', () => {
      const onLoadMore = vi.fn()
      renderForLoadMore(onLoadMore, { loading: true })
      triggerIntersection(true)
      expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('calls onLoadMore only once when the sentinel intersects repeatedly before the loading flag updates', () => {
      const onLoadMore = vi.fn()
      renderForLoadMore(onLoadMore)
      triggerIntersection(true)
      triggerIntersection(true)
      triggerIntersection(true)
      expect(onLoadMore).toHaveBeenCalledTimes(1)
    })

    it('loads the next page after a load-more cycle completes', () => {
      const onLoadMore = vi.fn()
      const { rerender } = render(endlessTable(onLoadMore))
      triggerIntersection(true)
      expect(onLoadMore).toHaveBeenCalledTimes(1)

      rerender(endlessTable(onLoadMore, { isLoadingMore: true }))
      rerender(endlessTable(onLoadMore, { rowCount: SMALL_SET * 2 }))
      triggerIntersection(true)
      expect(onLoadMore).toHaveBeenCalledTimes(2)
    })

    it('stays unblocked after a load that returns no new rows', () => {
      const onLoadMore = vi.fn()
      const { rerender } = render(endlessTable(onLoadMore))
      triggerIntersection(true)
      expect(onLoadMore).toHaveBeenCalledTimes(1)

      rerender(endlessTable(onLoadMore, { isLoadingMore: true }))
      rerender(endlessTable(onLoadMore))
      triggerIntersection(true)
      expect(onLoadMore).toHaveBeenCalledTimes(2)
    })

    it('does not call onLoadMore when isLoadingMore is true', () => {
      const onLoadMore = vi.fn()
      renderForLoadMore(onLoadMore, { isLoadingMore: true })
      triggerIntersection(true)
      expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('does not call onLoadMore when sentinel is not intersecting', () => {
      const onLoadMore = vi.fn()
      renderForLoadMore(onLoadMore)
      triggerIntersection(false)
      expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('does not fire onLoadMore when endless is false (observer not set up)', () => {
      const onLoadMore = vi.fn()
      renderForLoadMore(onLoadMore, { endless: false })
      triggerIntersection(true)
      expect(onLoadMore).not.toHaveBeenCalled()
    })
  })

  describe('loading indicator', () => {
    it('shows spinner (no text) when isLoadingMore is true in endless mode', () => {
      const { container } = render(
        <Table
          columns={COLUMNS}
          data={makeData(SMALL_SET)}
          endless
          isLoadingMore
        />
      )
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      expect(container.querySelector('[class*="spinner"]')).toBeInTheDocument()
    })

    it('does not show spinner when isLoadingMore is false in endless mode', () => {
      const { container } = render(
        <Table
          columns={COLUMNS}
          data={makeData(SMALL_SET)}
          endless
          isLoadingMore={false}
        />
      )
      expect(screen.getByText('Item 1')).toBeInTheDocument()
      expect(
        container.querySelector('[class*="endlessLoader"]')
      ).not.toBeInTheDocument()
    })

    it('does not show endless spinner when not in endless mode', () => {
      const { container } = render(
        <Table
          columns={COLUMNS}
          data={makeData(SMALL_SET)}
          isLoadingMore
        />
      )
      expect(
        container.querySelector('[class*="endlessLoader"]')
      ).not.toBeInTheDocument()
    })

    it('suppresses empty state and shows spinner when loading=true with empty data in endless mode', () => {
      const { container } = render(
        <Table
          columns={COLUMNS}
          data={[]}
          endless
          loading
        />
      )
      expect(
        screen.queryByTestId('table-empty-message')
      ).not.toBeInTheDocument()
      expect(
        container.querySelector('[class*="bodyLoader"]')
      ).toBeInTheDocument()
    })

    it('shows empty state (not spinner) when loading=false and data=[] in endless mode', () => {
      render(
        <Table
          columns={COLUMNS}
          data={[]}
          endless
        />
      )
      expect(screen.getByTestId('table-empty-message')).toBeInTheDocument()
    })
  })
})
