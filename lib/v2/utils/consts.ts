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
