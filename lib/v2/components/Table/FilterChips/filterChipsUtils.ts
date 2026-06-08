import { COMMA_SEPARATOR, EMPTY_STRING } from '#v2/utils/consts'

/** Estimated pixels per character for width calculation */
export const PIXELS_PER_CHARACTER = 8
/** Maximum width before using compact chip view */
export const MAX_CHIP_WIDTH = 200
/** Maximum number of values before using compact view */
export const MAX_VALUES_WITHOUT_COMPACT = 3
/** Scroll amount in pixels */
export const SCROLL_AMOUNT = 200

export interface FilterValueResult {
  compact: boolean
  display: string
  values?: string[]
  customLabel?: string
}

/** Calculates the estimated display width of text in pixels */
export function calculateDisplayWidth(text: string): number {
  return text.length * PIXELS_PER_CHARACTER
}

/**
 * Determines if a compact view should be used for filter chips based on the
 * number of values and estimated width.
 */
export function shouldUseCompactView(
  values: string[],
  maxWidth: number = MAX_CHIP_WIDTH
): boolean {
  if (values.length <= 1) {
    return false
  }

  const commaSeparatedText = values.join(COMMA_SEPARATOR)
  const estimatedWidth = calculateDisplayWidth(commaSeparatedText)

  return estimatedWidth > maxWidth || values.length > MAX_VALUES_WITHOUT_COMPACT
}

/**
 * Formats a multiselect filter value for display, returning compact view info
 * when values exceed the threshold.
 */
export function formatMultiselectFilter(values: string[]): FilterValueResult {
  if (values.length === 0) {
    return { compact: false, display: EMPTY_STRING }
  }
  if (values.length === 1) {
    return { compact: false, display: values[0] }
  }

  const useCompact = shouldUseCompactView(values)
  if (useCompact) {
    return {
      compact: true,
      display: values[0],
      values: values.slice(1)
    }
  }
  return {
    compact: false,
    display: values.join(COMMA_SEPARATOR)
  }
}

/** Formats a datetime filter value for display, showing from and/or to dates */
export function formatDatetimeFilter(dateValue: {
  from?: string
  to?: string
}): FilterValueResult {
  const parts = []
  if (dateValue.from) {
    parts.push(`from ${new Date(dateValue.from).toLocaleDateString()}`)
  }
  if (dateValue.to) {
    parts.push(`to ${new Date(dateValue.to).toLocaleDateString()}`)
  }
  return { compact: false, display: parts.join(' ') }
}
