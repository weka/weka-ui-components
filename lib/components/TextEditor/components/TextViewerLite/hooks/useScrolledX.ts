import { useEffect, useState } from 'react'
import Utils from '~utils'

function useScrolledX({ element }: { element: HTMLDivElement | null }) {
  const [isScrolledX, setScrolledX] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = Utils.debounce(() => {
      if (element && element.scrollLeft > 0) {
        setScrolledX(true)
      } else {
        setScrolledX(false)
      }
    })

    if (element) {
      element.addEventListener('scroll', handleScroll)

      return () => {
        element.removeEventListener('scroll', handleScroll)
      }
    }
  }, [element])

  return isScrolledX
}

export default useScrolledX
