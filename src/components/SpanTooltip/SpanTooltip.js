import React, { useEffect, useRef, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../Tooltip'
import { EMPTY_STRING } from '../../consts'
import Utils from '../../utils'

import './spanTooltip.scss'

function SpanTooltip({ children, extraClasses, style }) {
  const ref = useRef(null)
  const [tooltip, setTooltip] = useState(EMPTY_STRING)

  useEffect(() => {
    const compareSize = () => {
      if (Utils.isEllipsisActive(ref.current)) {
        setTooltip(children)
      } else {
        setTooltip(EMPTY_STRING)
      }
    }
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [children])
  const classes = classNames({
    [extraClasses]: true,
    'span-tooltip': true
  })
  return (
    <Tooltip data={tooltip}>
      <span className={classes} ref={ref} style={style}>
        {children}
      </span>
    </Tooltip>
  )
}

SpanTooltip.defaultProps = { extraClasses: EMPTY_STRING, children: EMPTY_STRING, style: {} }

SpanTooltip.propTypes = {
  children: propTypes.oneOfType([propTypes.string, propTypes.number]),
  extraClasses: propTypes.string,
  style: propTypes.object
}

export default SpanTooltip
