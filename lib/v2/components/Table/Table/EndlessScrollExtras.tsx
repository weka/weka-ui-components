import type { RefObject } from 'react'

import { Spinner } from '../../Spinner'

import styles from './table.module.scss'

interface EndlessScrollExtrasProps {
  readonly endless: boolean
  readonly isLoadingMore: boolean | undefined
  readonly loading?: boolean
  readonly sentinelRef: RefObject<HTMLDivElement>
}

/**
 * Renders the sentinel div (observed by the IntersectionObserver in endless
 * mode) and an optional loading indicator placed after the table body.
 *
 * When `endless` is false both elements are suppressed — this component is
 * always mounted so the sentinel ref is always available for the observer hook,
 * but it renders nothing unless the table is in endless-scroll mode.
 */
export function EndlessScrollExtras({
  endless,
  isLoadingMore,
  loading = false,
  sentinelRef
}: EndlessScrollExtrasProps) {
  if (!endless) {
    return <div ref={sentinelRef} />
  }

  return (
    <>
      {isLoadingMore && !loading ? (
        <div className={styles.endlessLoader}>
          <Spinner />
        </div>
      ) : null}
      <div ref={sentinelRef} />
    </>
  )
}
