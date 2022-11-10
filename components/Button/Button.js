import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { CircularProgress } from '@mui/material'

import './button.scss'

function Button(props) {
  const { children, onClick, extraClass, disable, isLoading, empty, fullWidth, small, ...rest } = props
  const { type = 'button' } = rest
  const classes = classNames({
    button: true,
    empty,
    small,
    'full-width': fullWidth,
    [extraClass]: true,
    loading: isLoading,
    disable
  })
  return (
    // eslint-disable-next-line react/button-has-type
    <button className={classes} onClick={onClick} {...rest} type={type} disabled={disable}>
      {!isLoading
        ? (
          <div className='btn-children-wrapper'>
            {children}
          </div>
        )
        : <CircularProgress size={17} sx={{ color: 'currentColor' }} />}
    </button>
  )
}

Button.defaultProps = {
  empty: false,
  small: false,
  disable: false,
  fullWidth: false,
  isLoading: false,
  extraClass: '',
  onClick: () => {}
}

Button.propTypes = {
  children: propTypes.any.isRequired,
  disable: propTypes.bool,
  small: propTypes.bool,
  empty: propTypes.bool,
  fullWidth: propTypes.bool,
  isLoading: propTypes.bool,
  extraClass: propTypes.string,
  onClick: propTypes.func
}

export default Button
