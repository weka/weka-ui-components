import { EMPTY_STRING } from '#v2/utils/consts'

export type SelectOptionValue = string | number

export function normalizeSelectValue(
  value: SelectOptionValue | SelectOptionValue[] | undefined,
  multiple: boolean
): SelectOptionValue | SelectOptionValue[] {
  if (value !== undefined) {
    return value
  }
  return multiple ? [] : EMPTY_STRING
}

export function getNextEnabledIndex(
  options: readonly { disabled?: boolean }[],
  current: number,
  step: number
): number {
  let next = current + step
  while (next >= 0 && next < options.length && options[next].disabled) {
    next += step
  }
  return next >= 0 && next < options.length ? next : current
}

/**
 * Enforce the "any" option's exclusivity in a multi-select: selecting `anyValue`
 * clears every other value, and selecting any other value clears `anyValue`.
 */
export function applyAnyValueRules(
  nextValues: SelectOptionValue[],
  prevValues: SelectOptionValue[],
  anyValue: SelectOptionValue | undefined
): SelectOptionValue[] {
  if (!anyValue) {
    return nextValues
  }

  if (nextValues.length === 0) {
    return [anyValue]
  }

  const prevHadAny = prevValues.includes(anyValue)
  const nextHasAny = nextValues.includes(anyValue)

  if (nextHasAny && !prevHadAny) {
    return [anyValue]
  }

  if (nextHasAny && nextValues.length > 1) {
    return nextValues.filter((entry) => entry !== anyValue)
  }

  return nextValues
}
