import type { RefObject } from 'react'
import { useEffect } from 'react'

import { DOM_EVENTS, EMPTY_REF_ARRAY, EMPTY_STRING_ARRAY } from '../utils/consts'

interface UseClickOutsideOptions {
  additionalRefs?: RefObject<HTMLElement>[]
  additionalSelectors?: string[]
  additionalDataAttributes?: string[]
  enabled?: boolean
}

/**
 * Check if click target is inside the main ref
 */
function isClickInsideMainRef(
  ref: RefObject<HTMLElement>,
  target: HTMLElement
): boolean {
  return Boolean(ref.current && ref.current.contains(target))
}

/**
 * Check if the main ref has any of the specified data attributes set to 'true'
 */
function hasDataAttributeOnRef(
  ref: RefObject<HTMLElement>,
  dataAttributes: readonly string[]
): boolean {
  return dataAttributes.some(
    (attr) => ref.current?.getAttribute(attr) === 'true'
  )
}

/**
 * Check if click target is inside any of the additional refs
 */
function isClickInsideAdditionalRefs(
  refs: readonly RefObject<HTMLElement>[],
  target: HTMLElement
): boolean {
  return refs.some((r) => r.current && r.current.contains(target))
}

/**
 * Check if click target matches any of the selectors
 */
function isClickOnMatchedSelector(
  target: HTMLElement,
  selectors: readonly string[]
): boolean {
  return selectors.some((selector) => target.closest(selector))
}

/**
 * Check if any ancestor element has any of the data attributes set to 'true'
 */
function hasDataAttributeInAncestors(
  target: HTMLElement,
  dataAttributes: readonly string[]
): boolean {
  let currentElement: HTMLElement | null = target

  while (currentElement && currentElement !== document.body) {
    const hasAttribute = dataAttributes.some(
      (attr) => currentElement?.getAttribute(attr) === 'true'
    )
    if (hasAttribute) {
      return true
    }
    currentElement = currentElement.parentElement
  }

  return false
}

/**
 * Hook to handle clicks outside of specified elements.
 *
 * @param ref - Main element ref to check clicks outside of
 * @param handler - Callback function to execute when a click is outside. **Must be memoized.**
 * @param options - Additional options for more complex scenarios
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void,
  options: UseClickOutsideOptions = {}
) => {
  const {
    additionalRefs = EMPTY_REF_ARRAY,
    additionalSelectors = EMPTY_STRING_ARRAY,
    additionalDataAttributes = EMPTY_STRING_ARRAY,
    enabled = true
  } = options

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (isClickInsideMainRef(ref, target)) {
        return
      }

      if (hasDataAttributeOnRef(ref, additionalDataAttributes)) {
        return
      }

      if (isClickInsideAdditionalRefs(additionalRefs, target)) {
        return
      }

      if (isClickOnMatchedSelector(target, additionalSelectors)) {
        return
      }

      if (hasDataAttributeInAncestors(target, additionalDataAttributes)) {
        return
      }

      handler()
    }

    document.addEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)

    return () => {
      document.removeEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)
    }
  }, [
    ref,
    handler,
    additionalRefs,
    additionalSelectors,
    additionalDataAttributes,
    enabled
  ])
}
