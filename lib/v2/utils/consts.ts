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

// Tooltip placements
export const TOOLTIP_PLACEMENTS = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right'
} as const

export type TooltipPlacement =
  (typeof TOOLTIP_PLACEMENTS)[keyof typeof TOOLTIP_PLACEMENTS]
