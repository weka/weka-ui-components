import React, { useEffect, useState } from 'react'
import { TopArrow } from '../../../../svgs'
import Tooltip from '../../../Tooltip'

import './scrollToTop.scss'

interface ScrollToTopProps {
  scrollElement: HTMLElement | null
}

function ScrollToTop({ scrollElement }: ScrollToTopProps) {
  const [isHidden, setIsHidden] = useState(true)

  useEffect(() => {
    if (!scrollElement) {
      return
    }

    const onScroll = () => {
      setIsHidden(scrollElement.scrollTop === 0)
    }

    setIsHidden(scrollElement.scrollTop === 0)

    scrollElement.addEventListener('scroll', onScroll)
    return () => scrollElement.removeEventListener('scroll', onScroll)
  }, [scrollElement])

  const handleClick = () => {
    if (!scrollElement) {
      return
    }

    scrollElement.scroll({ top: 0, left: 0, behavior: 'smooth' })

    // due to virtualized scroll, sometimes the element isn't scrolled to the top
    requestAnimationFrame(() => {
      scrollElement.scrollTop = 0
    })
  }

  return (
    !isHidden && (
      <Tooltip data='Scroll to top'>
        <TopArrow className='arrow-top-table' onClick={handleClick} />
      </Tooltip>
    )
  )
}

export default ScrollToTop
