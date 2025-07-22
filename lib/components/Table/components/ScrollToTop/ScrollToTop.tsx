import React, { useEffect, useState } from 'react'
import svgs from 'svgs'
import Tooltip from '../../../Tooltip'

import './scrollToTop.scss'

const { TopArrow } = svgs

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

    scrollElement.scrollTop = 0
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
