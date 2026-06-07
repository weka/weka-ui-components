import { Fragment } from 'react'
import clsx from 'clsx'

import { ARROW_DIRECTIONS, ArrowIcon } from '../../../icons'

import styles from './pagination.module.scss'

const ELLIPSIS = '...'
const MAX_PAGES_WITHOUT_ELLIPSIS = 5
const SIDE_WINDOW = 2
const ALWAYS_ENABLED = () => true
const PREV_LABEL = 'Prev'
const NEXT_LABEL = 'Next'
const PREV_ARIA_LABEL = 'Go to previous page'
const NEXT_ARIA_LABEL = 'Go to next page'
const NAV_ARIA_LABEL = 'Pagination'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isPageEnabled?: (page: number) => boolean
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number
): (number | typeof ELLIPSIS)[] {
  if (totalPages <= MAX_PAGES_WITHOUT_ELLIPSIS) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages: (number | typeof ELLIPSIS)[] = [1]
  let start = currentPage
  let end = currentPage + SIDE_WINDOW

  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, totalPages - SIDE_WINDOW)
  }

  if (start > 2) {
    pages.push(ELLIPSIS)
  }

  for (let i = start; i <= end; i += 1) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i)
    }
  }

  if (end < totalPages) {
    pages.push(ELLIPSIS)
  }
  pages.push(totalPages)

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isPageEnabled = ALWAYS_ENABLED
}: Readonly<PaginationProps>) {
  const pages = generatePageNumbers(currentPage, totalPages)
  const isPrevEnabled = currentPage > 1 && isPageEnabled(currentPage - 1)
  const isNextEnabled =
    currentPage < totalPages && isPageEnabled(currentPage + 1)

  const handlePrevClick = () => {
    if (isPrevEnabled) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextClick = () => {
    if (isNextEnabled) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage && isPageEnabled(page)) {
      onPageChange(page)
    }
  }

  const renderPageNumber = (page: number) => {
    const isActive = page === currentPage
    const isEnabled = isPageEnabled(page)

    return (
      <button
        aria-current={isActive ? 'page' : undefined}
        disabled={!isActive && !isEnabled}
        onClick={() => handlePageClick(page)}
        type='button'
        className={clsx(
          isActive ? styles.activePageButton : styles.pageButton,
          !isActive && !isEnabled && styles.disabled
        )}
      >
        {page}
      </button>
    )
  }

  return (
    <nav
      aria-label={NAV_ARIA_LABEL}
      className={styles.pagination}
    >
      <button
        aria-label={PREV_ARIA_LABEL}
        className={clsx(styles.navButton, !isPrevEnabled && styles.disabled)}
        disabled={!isPrevEnabled}
        onClick={handlePrevClick}
        type='button'
      >
        <ArrowIcon
          direction={ARROW_DIRECTIONS.LEFT}
          extraClass={styles.prevArrow}
        />
        <span>{PREV_LABEL}</span>
      </button>
      <div className={styles.pageNumbers}>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page === ELLIPSIS ? (
              <span
                aria-hidden='true'
                className={styles.ellipsis}
              >
                {ELLIPSIS}
              </span>
            ) : (
              renderPageNumber(page)
            )}
          </Fragment>
        ))}
      </div>
      <button
        aria-label={NEXT_ARIA_LABEL}
        className={clsx(styles.navButton, !isNextEnabled && styles.disabled)}
        disabled={!isNextEnabled}
        onClick={handleNextClick}
        type='button'
      >
        <span>{NEXT_LABEL}</span>
        <ArrowIcon
          direction={ARROW_DIRECTIONS.RIGHT}
          extraClass={styles.nextArrow}
        />
      </button>
    </nav>
  )
}
