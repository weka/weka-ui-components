import React from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import JsonEditor from '../../JsonEditor'
import { Info } from '../../../svgs'
import { EMPTY_STRING } from '../../../consts'

import './jsonBox.scss'

function JsonBox(props) {
  const { label, error, wrapperClass, info, isRequired, disabled, ...rest } = props
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

JsonBox.defaultProps = {
  value: undefined,
  error: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  label: EMPTY_STRING,
  isRequired: false,
  disabled: false,
  info: EMPTY_STRING
}

JsonBox.propTypes = {
  value: propTypes.string,
  wrapperClass: propTypes.string,
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  error: propTypes.any,
  disabled: propTypes.bool,
  isRequired: propTypes.bool,
  info: propTypes.any
}

export default JsonBox
