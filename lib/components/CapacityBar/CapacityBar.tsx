import React, { useRef, useEffect } from 'react'

import './capacityBar.scss'

interface CapacityBarProps {
  firstUsage?: number
  firstColor?: string
  secondUsage?: number
  secondColor?: string
}

function CapacityBar(props: CapacityBarProps) {
  const {
    firstUsage = 0,
    firstColor = 'var(--accent-s3)',
    secondUsage = 0,
    secondColor = 'var(--main-color)'
  } = props
  const firstRef = useRef<HTMLHeadingElement>(null)
  const secondRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current.style.width = `${firstUsage * 100}%`
    }
    if (secondRef.current) {
      secondRef.current.style.width = `${(secondUsage - firstUsage) * 100}%`
    }
  }, [firstUsage, secondUsage])

  return (
    <div className='capacity-bar'>
      <div
        className='usage'
        ref={firstRef}
        style={{ backgroundColor: firstColor }}
      />
      <div
        className='usage'
        ref={secondRef}
        style={{ backgroundColor: secondColor }}
      />
    </div>
  )
}

export default CapacityBar
