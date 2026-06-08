import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Pagination } from './Pagination'

const PREV_LABEL = 'Prev'
const NEXT_LABEL = 'Next'
const ELLIPSIS_LABEL = '...'

const SMALL_TOTAL = 5
const LARGE_TOTAL = 10
const TARGET_PAGE = 4
const MIDDLE_PAGE = 3
const NEAR_END_TOTAL_AFTER_TARGET = 8
const NEAR_END_TOTAL_BEFORE_LAST = 9

afterEach(() => {
  cleanup()
})

describe('Pagination - rendering', () => {
  it('renders all pages without ellipsis when totalPages is small', () => {
    render(
      <Pagination
        currentPage={1}
        onPageChange={vi.fn()}
        totalPages={SMALL_TOTAL}
      />
    )

    for (let page = 1; page <= SMALL_TOTAL; page += 1) {
      expect(screen.getByText(String(page))).toBeInTheDocument()
    }
    expect(screen.queryByText(ELLIPSIS_LABEL)).not.toBeInTheDocument()
  })

  it('renders ellipsis when there are more than 5 pages and current is in the middle', () => {
    render(
      <Pagination
        currentPage={SMALL_TOTAL}
        onPageChange={vi.fn()}
        totalPages={LARGE_TOTAL}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText(String(LARGE_TOTAL))).toBeInTheDocument()
    expect(screen.getAllByText(ELLIPSIS_LABEL).length).toBeGreaterThanOrEqual(1)
  })

  it('clamps the window when current is near the end', () => {
    render(
      <Pagination
        currentPage={LARGE_TOTAL}
        onPageChange={vi.fn()}
        totalPages={LARGE_TOTAL}
      />
    )

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(
      screen.getByText(String(NEAR_END_TOTAL_AFTER_TARGET))
    ).toBeInTheDocument()
    expect(
      screen.getByText(String(NEAR_END_TOTAL_BEFORE_LAST))
    ).toBeInTheDocument()
    expect(screen.getByText(String(LARGE_TOTAL))).toBeInTheDocument()
  })

  it('renders Prev and Next labels', () => {
    render(
      <Pagination
        currentPage={2}
        onPageChange={vi.fn()}
        totalPages={SMALL_TOTAL}
      />
    )

    expect(screen.getByText(PREV_LABEL)).toBeInTheDocument()
    expect(screen.getByText(NEXT_LABEL)).toBeInTheDocument()
  })
})

describe('Pagination - accessibility', () => {
  it('renders a nav landmark labelled Pagination', () => {
    render(
      <Pagination
        currentPage={1}
        onPageChange={vi.fn()}
        totalPages={SMALL_TOTAL}
      />
    )

    expect(
      screen.getByRole('navigation', { name: 'Pagination' })
    ).toBeInTheDocument()
  })

  it('marks the current page button with aria-current="page"', () => {
    render(
      <Pagination
        currentPage={MIDDLE_PAGE}
        onPageChange={vi.fn()}
        totalPages={SMALL_TOTAL}
      />
    )

    const currentButton = screen.getByRole('button', {
      name: String(MIDDLE_PAGE),
      current: 'page'
    })
    expect(currentButton).toBeInTheDocument()
  })

  it('uses descriptive aria-labels on Prev and Next', () => {
    render(
      <Pagination
        currentPage={MIDDLE_PAGE}
        onPageChange={vi.fn()}
        totalPages={SMALL_TOTAL}
      />
    )

    expect(
      screen.getByRole('button', { name: 'Go to previous page' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Go to next page' })
    ).toBeInTheDocument()
  })

  it('renders page numbers as <button> elements (keyboard accessible)', () => {
    render(
      <Pagination
        currentPage={1}
        onPageChange={vi.fn()}
        totalPages={SMALL_TOTAL}
      />
    )

    for (let page = 1; page <= SMALL_TOTAL; page += 1) {
      expect(
        screen.getByRole('button', { name: String(page) })
      ).toBeInTheDocument()
    }
  })
})

describe('Pagination - navigation', () => {
  it('calls onPageChange with previous page when Prev is clicked and enabled', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={MIDDLE_PAGE}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(PREV_LABEL))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when Next is clicked and enabled', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={MIDDLE_PAGE}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(NEXT_LABEL))
    expect(onPageChange).toHaveBeenCalledWith(TARGET_PAGE)
  })

  it('does not call onPageChange when Prev is clicked on page 1', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={1}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(PREV_LABEL))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('does not call onPageChange when Next is clicked on the last page', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={SMALL_TOTAL}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(NEXT_LABEL))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('calls onPageChange with the clicked page number', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={2}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(String(TARGET_PAGE)))
    expect(onPageChange).toHaveBeenCalledWith(TARGET_PAGE)
  })

  it('does not call onPageChange when the current page button is clicked', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={MIDDLE_PAGE}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(String(MIDDLE_PAGE)))
    expect(onPageChange).not.toHaveBeenCalled()
  })
})

describe('Pagination - isPageEnabled', () => {
  it('does not call onPageChange for a disabled page', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={1}
        isPageEnabled={(page) => page !== MIDDLE_PAGE}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(String(MIDDLE_PAGE)))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('disables Prev when isPageEnabled returns false for previous page', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={MIDDLE_PAGE}
        isPageEnabled={(page) => page !== 2}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(PREV_LABEL))
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('disables Next when isPageEnabled returns false for next page', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={MIDDLE_PAGE}
        isPageEnabled={(page) => page !== TARGET_PAGE}
        onPageChange={onPageChange}
        totalPages={SMALL_TOTAL}
      />
    )

    fireEvent.click(screen.getByText(NEXT_LABEL))
    expect(onPageChange).not.toHaveBeenCalled()
  })
})
