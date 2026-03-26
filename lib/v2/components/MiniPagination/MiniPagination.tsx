import clsx from 'clsx'

import { NavChevronLeftIcon, NavChevronRightIcon } from '../../icons'

import styles from './miniPagination.module.scss'

const ARROW_SIZE = 18

export interface MiniPaginationProps {
  currentPage: number
  totalPages: number
  onPrevPage: () => void
  onNextPage: () => void
}

export function MiniPagination({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage
}: Readonly<MiniPaginationProps>) {
  const isFirstPage = currentPage === 0
  const isLastPage = currentPage === totalPages - 1

  return (
    <div className={styles.container}>
      <button
        aria-label='Previous page'
        disabled={isFirstPage}
        onClick={onPrevPage}
        type='button'
        className={clsx(styles.button, {
          [styles.disabled]: isFirstPage
        })}
      >
        <NavChevronLeftIcon
          color='var(--gray-900-100)'
          height={ARROW_SIZE}
          width={ARROW_SIZE}
        />
      </button>
      <button
        aria-label='Next page'
        disabled={isLastPage}
        onClick={onNextPage}
        type='button'
        className={clsx(styles.button, {
          [styles.disabled]: isLastPage
        })}
      >
        <NavChevronRightIcon
          color='var(--gray-900-100)'
          height={ARROW_SIZE}
          width={ARROW_SIZE}
        />
      </button>
    </div>
  )
}
