/**
 * Helpers for the Table component's endless-scroll (infinite-scroll) mode.
 */

/**
 * Returns true when the IntersectionObserver callback should trigger a
 * load-more request. All conditions must hold simultaneously:
 *   - the sentinel element is intersecting the scroll viewport
 *   - there are more rows to load (`hasMore`)
 *   - a previous page load is not already in flight (`isLoadingMore`)
 *   - the initial/full-table query is not in flight (`isLoading`)
 *
 * The `isLoading` guard prevents requesting page 2 while the first query is
 * still resolving (empty or stale rows with the sentinel already in view).
 */
export function shouldLoadMore(
  isIntersecting: boolean,
  hasMore: boolean | undefined,
  isLoadingMore: boolean | undefined,
  isLoading: boolean | undefined
): boolean {
  return isIntersecting && !!hasMore && !isLoadingMore && !isLoading
}
