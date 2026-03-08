import React from 'react'
import clsx from 'clsx'

import { EMPTY_STRING } from 'consts'
import svgs from 'svgs'

import JsonEditor from '../../TextEditor'
import Tooltip from '../../Tooltip'

import './jsonBox.scss'

const { Info } = svgs

interface JsonBoxProps {
  value: string | undefined
  wrapperClass?: string
  label: string
  error?: string
  disabled?: boolean
  isRequired?: boolean
  info?: string
}
function JsonBox({
  label,
  error,
  wrapperClass = EMPTY_STRING,
  info,
  isRequired,
  disabled,
  ...rest
}: JsonBoxProps) {
  const classes = clsx({
    'json-box': true,
    'has-error': !!error,
    [wrapperClass]: true
  })

  return (
    <div className={classes}>
      <span className='json-box__label field-1-label-content'>
        {label}
        {isRequired ? <span className='required-star'>*</span> : null}
        {!!info && (
          <Tooltip data={info}>
            <Info />
          </Tooltip>
        )}
      </span>
      <JsonEditor
        readOnly={disabled}
        {...rest}
        tabSize={2}
      />
      <span className='json-box-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

export default JsonBox
