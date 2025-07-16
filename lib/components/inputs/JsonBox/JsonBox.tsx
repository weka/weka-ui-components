import React from 'react'
import clsx from 'clsx'
import { EMPTY_STRING } from 'consts'
import Tooltip from '../../Tooltip'
import JsonEditor from '../../TextEditor'
import svgs from 'svgs'

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
function JsonBox(props: JsonBoxProps) {
  const {
    label,
    error,
    wrapperClass = EMPTY_STRING,
    info,
    isRequired,
    disabled,
    ...rest
  } = props
  const classes = clsx({
    'json-box': true,
    'has-error': !!error,
    [wrapperClass]: true
  })

  return (
    <div className={classes}>
      <span className='json-box__label field-1-label-content'>
        {label}
        {isRequired && <span className='required-star'>*</span>}
        {!!info && (
          <Tooltip data={info}>
            <Info />
          </Tooltip>
        )}
      </span>
      <JsonEditor readOnly={disabled} {...rest} tabSize={2} />
      <span className='json-box-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

export default JsonBox
