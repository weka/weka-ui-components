import type { ReactElement } from 'react'

import { Fragment } from 'react'

import { ELLIPSIS } from '#v2/utils/consts'

const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g

/**
 * Truncates `text` to `maxLength` characters, replacing the tail with `...`.
 * The ellipsis counts toward the max length; shorter text is returned unchanged.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength - ELLIPSIS.length) + ELLIPSIS
}

/**
 * Formats a count for display, appending the maximum when provided
 * (e.g. `2 of 1024`).
 */
export function formatCountWithMax(count: number, maxCount?: number): string {
  return maxCount === undefined ? String(count) : `${count} of ${maxCount}`
}

/**
 * Wraps occurrences of `query` in `text` with a given element to highlight matches.
 * Case-insensitive. Returns ReactNode parts so React keys can be applied.
 */
export function highlightText(
  text: string,
  query: string,
  highlightElement: 'mark' | 'strong' | 'span' = 'mark',
  className?: string
): ReactElement {
  if (!query.trim()) {
    return <>{text}</>
  }

  const escapedQuery = query.replace(REGEX_ESCAPE_PATTERN, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          const Element = highlightElement
          return (
            <Element
              key={index}
              className={className}
            >
              {part}
            </Element>
          )
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}
