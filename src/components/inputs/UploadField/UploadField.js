import React, { useId, useState } from 'react'
import classNames from 'classnames'
import propTypes from 'prop-types'
import { IconButton } from '@mui/material'
import SpanTooltip from '../../SpanTooltip'
import { EMPTY_STRING } from '../../../consts'
import Utils from '../../../utils'
import { Close } from '../../../svgs'

import './uploadField.scss'

function UploadField(props) {
  const { label, onChange, disabled, wrapperClass, placeholder, error, ...rest } = props
  const id = useId()
  const [fileName, setFileName] = useState(EMPTY_STRING)
  const uploadWrapperClasses = classNames({
    'upload-wrapper': true,
    [wrapperClass]: true,
    'upload-wrapper-disabled': disabled
  })

  const onFileChange = (file) => {
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFileName(file.name)
        onChange(event.target.result)
      }
      reader.readAsText(file)
    } catch (e) {
      Utils.toastError('Failed to read file')
    }
  }

  return (
    <div className={uploadWrapperClasses}>
      <input
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        type='file'
        onClick={(e) => { // we need this to enable choosing the same file more than once in a row
          e.target.value = EMPTY_STRING
        }}
        onChange={(e) => {
          onFileChange(e.target.files[0])
        }}
        {...rest}
      />
      <label htmlFor={id} className='button small'>{label}</label>
      <span className='upload-field-error capitalize-first-letter'>{error}</span>
      {fileName && (
        <div className='file-name-wrapper'>
          <SpanTooltip extraClasses='file-name'>{fileName}</SpanTooltip>
          <IconButton onClick={() => {
            setFileName(EMPTY_STRING)
            onChange(EMPTY_STRING)
          }}
          >
            <Close />
          </IconButton>
        </div>
      )}
    </div>
  )
}

UploadField.defaultProps = {
  onChange: () => {},
  placeholder: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  label: EMPTY_STRING,
  error: EMPTY_STRING,
  disabled: false
}

UploadField.propTypes = {
  onChange: propTypes.func,
  wrapperClass: propTypes.string,
  placeholder: propTypes.string,
  label: propTypes.string,
  error: propTypes.string,
  disabled: propTypes.bool
}

export default UploadField
