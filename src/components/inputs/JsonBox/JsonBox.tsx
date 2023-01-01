import React from 'react'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import JsonEditor from '../../JsonEditor'
import { Info } from '../../../svgs'
import { EMPTY_STRING } from '../../../consts'

import './jsonBox.scss'

interface JsonBoxProps {
  value: string | undefined,
  wrapperClass?: string,
  label: string,
  error?: string,
  disabled?: boolean,
  isRequired?: boolean,
  info?: string
}
function JsonBox(props: JsonBoxProps) {
  const { label, error, wrapperClass = '', info, isRequired, disabled, ...rest } = props
  const classes = classNames({
    'json-box': true,
    'has-error': !!error,
    [wrapperClass]: true
  })

  return (
    <div className={classes}>
      <span className='json-box__label field-1-label-content'>
        {label}
        {isRequired && <span className='required-star'>*</span>}
        {!!info && <Tooltip data={info}><Info /></Tooltip>}
      </span>
      <JsonEditor readOnly={disabled} {...rest} tabSize={2} />
      <span className='json-box-error capitalize-first-letter'>{error}</span>
    </div>
  )
}

export default JsonBox
