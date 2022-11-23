import React, { useRef, useEffect } from 'react'
import propTypes from 'prop-types'

import './capacityBar.scss'

function CapacityBar(props) {
  const { firstUsage, firstColor, secondUsage, secondColor } = props
  const firstRef = useRef(null)
  const secondRef = useRef(null)

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current.style.width = `${firstUsage * 100}%`
      secondRef.current.style.width = `${(secondUsage - firstUsage) * 100}%`
    }
  }, [firstUsage, secondUsage])

  return (
    <div className='capacity-bar'>
      <div className='usage' ref={firstRef} style={{ backgroundColor: firstColor }} />
      <div className='usage' ref={secondRef} style={{ backgroundColor: secondColor }}/>
    </div>
  )
}

CapacityBar.defaultProps = {
  firstUsage: 0,
  firstColor: 'var(--accent-s3)',
  secondUsage: 0,
  secondColor: 'var(--main-color)'
}

CapacityBar.propTypes = {
  firstUsage: propTypes.number,
  firstClass: propTypes.string,
  secondUsage: propTypes.number,
  secondClass: propTypes.string
}

export default CapacityBar
