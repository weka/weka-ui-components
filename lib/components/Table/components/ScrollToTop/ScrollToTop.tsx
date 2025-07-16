import React, { useEffect, useState } from 'react'
import { TopArrow } from '../../../../svgs'
import Tooltip from '../../../Tooltip'

import './scrollToTop.scss'

interface ScrollToTopProps {
  scrollElement: HTMLElement | null
  scrollInfToTop: () => void
}

function ScrollToTop({ scrollElement, scrollInfToTop }: ScrollToTopProps) {
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

    scrollInfToTop()
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
