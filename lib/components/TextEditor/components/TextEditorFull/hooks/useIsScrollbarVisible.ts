import { useEffect, useState } from 'react'

function useIsScrollbarVisible({ editorReady }: { editorReady: boolean }) {
  const [isScrollbarVisible, setIsScrollbarVisible] = useState<boolean | null>(
    null
  )

  useEffect(() => {
    const verticalScrollbar = document.querySelector(
      '.ace_scrollbar.ace_scrollbar-v'
    ) as HTMLElement | null

    if (!verticalScrollbar || !editorReady) {
      return
    }

    const updateIsScrollbarVisible = () => {
      const isVisible = verticalScrollbar.style.display !== 'none'
      setIsScrollbarVisible(isVisible)
    }

    updateIsScrollbarVisible()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          updateIsScrollbarVisible()
        }
      })
    })

    observer.observe(verticalScrollbar, {
      attributes: true,
      attributeFilter: ['style'],
      childList: false,
      subtree: false
    })

    return () => {
      observer.disconnect()
    }
  }, [editorReady])

  return isScrollbarVisible
}

export default useIsScrollbarVisible
