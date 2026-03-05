import { useEffect } from 'react'

/**
 * Hook to execute a callback when the window is resized
 * @param callback - Function to call on resize
 * @param dependencies - Array of dependencies that should trigger re-registration
 */
export function useResizeObserver(
  callback: () => void,
  dependencies: unknown[] = []
): void {
  useEffect(() => {
    callback()

    window.addEventListener('resize', callback)

    return () => {
      window.removeEventListener('resize', callback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
