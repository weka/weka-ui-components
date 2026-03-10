import type { MouseEventHandler } from 'react'
import React from 'react'
import { CircularProgress } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'

import './button.scss'

export interface ButtonProps {
  children: any
  disable?: boolean
  small?: boolean
  empty?: boolean
  fullWidth?: boolean
  isLoading?: boolean
  extraClass?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  [key: string]: any
}

function Button({
  children,
  onClick,
  extraClass = EMPTY_STRING,
  disable,
  isLoading = false,
  empty,
  fullWidth,
  small,
  ...rest
}: ButtonProps) {
  const { type = 'button' } = rest
  const classes = clsx({
    button: true,
    empty,
    small,
    'full-width': fullWidth,
    [extraClass]: true,
    loading: isLoading,
    disable
  })

  return (
    <button
      className={classes}
      onClick={onClick}
      {...rest}
      disabled={disable}
      type={type}
    >
      {!isLoading ? (
        <div className='btn-children-wrapper'>{children}</div>
      ) : (
        <CircularProgress
          size={small ? 11 : 17}
          sx={{ color: 'currentColor' }}
        />
      )}
    </button>
  )
}

export default Button
