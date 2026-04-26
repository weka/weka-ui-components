/**
 * Generic UI constants for v2 components.
 * Migrated from observe/frontend/src/components/utils/consts.ts
 */
import type { RefObject } from 'react'

// Empty value constants
// eslint-disable-next-line @weka/weka/no-empty-strings
export const EMPTY_STRING = ''

export const EMPTY_ARRAY: readonly never[] = []
export const EMPTY_STRING_ARRAY: readonly string[] = []
export const EMPTY_REF_ARRAY: readonly RefObject<HTMLElement>[] = []
export const EMPTY_OBJECT: Record<string, never> = {}
export const EMPTY_SET = new Set<never>()

export const NOOP = () => {}
export const NOT_APPLICABLE = 'N/A'
export const COMMA_SEPARATOR = ', '
export const SEARCH_PLACEHOLDER = 'Search...'

// Percentage constants
export const PERCENTAGE = {
  FULL: 100,
  HALF: 50
}

// Keyboard keys
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  BACKSPACE: 'Backspace',
  TAB: 'Tab',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight'
} as const

// DOM event names
export const DOM_EVENTS = {
  KEYDOWN: 'keydown',
  MOUSEDOWN: 'mousedown',
  RESIZE: 'resize'
} as const

// Theme-aware CSS variable defaults
export const CSS_VARS = {
  GRAY_900_100: 'var(--gray-900-100)'
} as const

// Tooltip placements
export const TOOLTIP_PLACEMENTS = {
  TOP: 'top',
  TOP_START: 'top-start',
  TOP_END: 'top-end',
  BOTTOM: 'bottom',
  BOTTOM_START: 'bottom-start',
  BOTTOM_END: 'bottom-end',
  LEFT: 'left',
  RIGHT: 'right'
} as const

export type TooltipPlacement =
  (typeof TOOLTIP_PLACEMENTS)[keyof typeof TOOLTIP_PLACEMENTS]

// Severity
export const SEVERITY_TYPES = {
  CRITICAL: 'critical',
  MAJOR: 'major',
  MINOR: 'minor',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'debug',
  DEFAULT: 'default'
} as const

export type Severity = (typeof SEVERITY_TYPES)[keyof typeof SEVERITY_TYPES]

export type BaseSeverity = Exclude<Severity, typeof SEVERITY_TYPES.DEFAULT>

export type SeverityLevel = (typeof SEVERITY_ORDER_ASC)[number]

export const SEVERITY_ORDER_ASC = [
  SEVERITY_TYPES.INFO,
  SEVERITY_TYPES.WARNING,
  SEVERITY_TYPES.MINOR,
  SEVERITY_TYPES.MAJOR,
  SEVERITY_TYPES.CRITICAL
] as const

export const SEVERITY_ORDER_DESC = [
  SEVERITY_TYPES.CRITICAL,
  SEVERITY_TYPES.MAJOR,
  SEVERITY_TYPES.MINOR,
  SEVERITY_TYPES.WARNING,
  SEVERITY_TYPES.INFO
] as const

export const SEVERITY_LABELS = {
  [SEVERITY_TYPES.CRITICAL]: 'Critical',
  [SEVERITY_TYPES.MAJOR]: 'Major',
  [SEVERITY_TYPES.MINOR]: 'Minor',
  [SEVERITY_TYPES.WARNING]: 'Warning',
  [SEVERITY_TYPES.INFO]: 'Info',
  [SEVERITY_TYPES.DEBUG]: 'Debug',
  [SEVERITY_TYPES.DEFAULT]: 'Info'
} as const

// Cloud icon variants
export const CLOUD_ICON_VARIANTS = {
  DEFAULT: 'default',
  HEADER: 'header'
} as const

export type CloudIconVariant =
  (typeof CLOUD_ICON_VARIANTS)[keyof typeof CLOUD_ICON_VARIANTS]

// Date/time constants
export const DAYS_IN_WEEK = 7

export const SHORT_DAY_OF_WEEK = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun'
] as const

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const

export const TIME_PARTS = {
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second'
} as const

export type TimePart = (typeof TIME_PARTS)[keyof typeof TIME_PARTS]

export const TIME_FORMATS = {
  DATE: 'yyyy-MM-dd',
  MONTH_DAY_TIME: 'MMM dd HH:mm',
  MONTH_DAY: 'MMM dd',
  DATE_TIME: 'yyyy-MM-dd HH:mm',
  DATE_TIME_SECONDS: 'yyyy-MM-dd HH:mm:ss',
  DATE_TIME_SECONDS_MS: 'yyyy-MM-dd HH:mm:ss.SSS',
  HOUR_MIN: 'HH:mm',
  MAIN_DATE_TIME_FORMAT: 'MMM dd, yyyy HH:mm'
} as const

export type TimeFormat = (typeof TIME_FORMATS)[keyof typeof TIME_FORMATS]
