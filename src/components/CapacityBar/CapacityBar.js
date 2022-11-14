import React, { useRef, useEffect } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'

import './capacityBar.scss'

function CapacityBar(props) {
  const { firstUsage, firstClass, secondUsage, secondClass } = props
  const firstRef = useRef(null)
  const secondRef = useRef(null)

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current.style.width = `${firstUsage * 100}%`
      secondRef.current.style.width = `${(secondUsage - firstUsage) * 100}%`
    }
  }, [firstUsage, secondUsage])

  const firstUsageClasses = classNames({
    usage: true,
    [firstClass]: true
  })

  const secondUsageClasses = classNames({
    usage: true,
    [secondClass]: true
  })
  return (
    <div className='capacity-bar'>
      <div className={firstUsageClasses} ref={firstRef} />
      <div className={secondUsageClasses} ref={secondRef} />
    </div>
  )
}

CapacityBar.defaultProps = {
  firstUsage: 0,
  firstClass: 'total-usage',
  secondUsage: 0,
  secondClass: ''
}

CapacityBar.propTypes = {
  firstUsage: propTypes.number,
  firstClass: propTypes.string,
  secondUsage: propTypes.number,
  secondClass: propTypes.string
}

export default CapacityBar
