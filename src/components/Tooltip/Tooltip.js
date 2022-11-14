import React from 'react'
import { Tooltip as MuiTooltip } from '@mui/material'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { EMPTY_STRING } from '../../consts'

import './tooltip.scss'

function Tooltip({ children, clear, data, extraClass, ...rest }) {
  const classes = classNames({
    'tooltip-wrapper': true,
    'clear-tooltip': clear,
    [extraClass]: true
  })
  return (
    <MuiTooltip
      enterNextDelay={400}
      enterDelay={400}
      title={data}
      classes={{ tooltip: classes, arrow: 'tooltip-arrow' }}
      placement='top'
      arrow
      {...rest}
    >
      {children}
    </MuiTooltip>
  )
}

Tooltip.defaultProps = {
  data: EMPTY_STRING,
  clear: false,
  extraClass: EMPTY_STRING
}

Tooltip.propTypes = {
  children: propTypes.node.isRequired,
  clear: propTypes.bool,
  data: propTypes.oneOfType([propTypes.string, propTypes.element]),
  extraClass: propTypes.string
}

export default Tooltip
