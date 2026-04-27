import type { ReactElement } from 'react'
import { Fragment } from 'react'

const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g

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
