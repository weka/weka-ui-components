import { KEYBOARD_KEYS } from '#v2/utils/consts'

const NEXT_OPTION_KEYS = new Set<string>([
  KEYBOARD_KEYS.ARROW_RIGHT,
  KEYBOARD_KEYS.ARROW_DOWN
])
const PREVIOUS_OPTION_KEYS = new Set<string>([
  KEYBOARD_KEYS.ARROW_LEFT,
  KEYBOARD_KEYS.ARROW_UP
])

/**
 * Maps a keydown's key to the option index it should move focus/selection
 * to, wrapping at either end of the group. Returns `undefined` for keys the
 * card group doesn't handle as navigation.
 */
export function resolveArrowKeyIndex(
  key: string,
  currentIndex: number,
  optionCount: number
): number | undefined {
  if (NEXT_OPTION_KEYS.has(key)) {
    return (currentIndex + 1) % optionCount
  }
  if (PREVIOUS_OPTION_KEYS.has(key)) {
    return (currentIndex - 1 + optionCount) % optionCount
  }
  if (key === 'Home') {
    return 0
  }
  if (key === 'End') {
    return optionCount - 1
  }
  return undefined
}
