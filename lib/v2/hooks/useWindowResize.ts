import { useEffect } from 'react'

import { DOM_EVENTS } from '../utils/consts'

/**
 * Hook to execute a callback when the window is resized
 * @param callback - Function to call on resize
 * @param dependencies - Array of dependencies that should trigger re-registration
 */
export function useWindowResize(
  callback: () => void,
  dependencies: unknown[] = []
): void {
  useEffect(() => {
    callback()

    window.addEventListener(DOM_EVENTS.RESIZE, callback)

    return () => {
      window.removeEventListener(DOM_EVENTS.RESIZE, callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
