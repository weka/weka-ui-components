import React, { useEffect, useRef } from 'react'

import './capacityBar.scss'

interface CapacityBarProps {
  firstUsage?: number
  firstColor?: string
  secondUsage?: number
  secondColor?: string
}

function CapacityBar({
  firstUsage = 0,
  firstColor = 'var(--accent-s3)',
  secondUsage = 0,
  secondColor = 'var(--main-color)'
}: CapacityBarProps) {
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
        ref={firstRef}
        className='usage'
        style={{ backgroundColor: firstColor }}
      />
      <div
        ref={secondRef}
        className='usage'
        style={{ backgroundColor: secondColor }}
      />
    </div>
  )
}

export default CapacityBar
