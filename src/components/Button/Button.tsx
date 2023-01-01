import React, { MouseEventHandler } from "react"
import classNames from 'classnames'
import { CircularProgress } from '@mui/material'
import "./button.scss";

export interface ButtonProps {
    children: any,
    disable?: boolean,
    small?: boolean,
    empty?: boolean,
    fullWidth?: boolean,
    isLoading?: boolean,
    extraClass?: string,
    onClick?: MouseEventHandler<HTMLButtonElement>
    [key: string]: any
}

function Button(props: ButtonProps) {
  const { children, onClick, extraClass = '', disable, isLoading, empty, fullWidth, small, ...rest } = props
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

export default Button;
