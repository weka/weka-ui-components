import React, { useEffect, useRef, useState } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../Tooltip'
import { EMPTY_STRING } from '../../consts'
import Utils from '../../utils'

import './spanTooltip.scss'

function SpanTooltip({ children, extraClasses }) {
  const ref = useRef(null)
  const [tooltip, setTooltip] = useState(EMPTY_STRING)

  const compareSize = () => {
    if (Utils.isEllipsisActive(ref.current)) {
      setTooltip(children)
    } else {
      setTooltip(EMPTY_STRING)
    }
  }

  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [children?.length])
  const classes = classNames({
    [extraClasses]: true,
    'span-tooltip': true
  })
  return (
    <Tooltip data={tooltip}>
      <span className={classes} ref={ref}>
        {children}
      </span>
    </Tooltip>
  )
}

SpanTooltip.defaultProps = { extraClasses: EMPTY_STRING, children: EMPTY_STRING }

SpanTooltip.propTypes = { children: propTypes.oneOfType([propTypes.string, propTypes.number]), extraClasses: propTypes.string }

export default SpanTooltip
