import React, { useId, useState } from 'react'
import classNames from 'classnames'
import { IconButton } from '@mui/material'
import SpanTooltip from '../../SpanTooltip'
import { EMPTY_STRING, NOP } from '../../../consts'
import { Close } from '../../../svgs'
import Tooltip from '../../Tooltip'

import './uploadField.scss'

interface UploadFieldProps {
  onChange?: (newVal: any) => void
  onReadError?: () => void
  wrapperClass?: string
  placeholder?: string
  label: string
  error?: string
  disabled?: boolean
  tooltipText?: string
  shouldBeBinary?: boolean
}
function UploadField(props: UploadFieldProps) {
  const {
    label,
    onChange = NOP,
    disabled,
    wrapperClass = '',
    placeholder,
    error,
    onReadError,
    tooltipText = EMPTY_STRING,
    shouldBeBinary = false,
    ...rest
  } = props
  const id = useId()
  const [fileName, setFileName] = useState(EMPTY_STRING)
  const uploadWrapperClasses = classNames({
    'upload-wrapper': true,
    [wrapperClass]: true,
    'upload-wrapper-disabled': disabled
  })

  const onFileChange = (file) => {
    if (shouldBeBinary) {
      onChange(file)
      return
    }
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFileName(file.name)
        onChange(event.target.result)
      }
      reader.readAsText(file)
    } catch (e) {
      onReadError()
    }
  }

  return (
    <Tooltip data={tooltipText}>
      <div className={uploadWrapperClasses}>
        <input
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          type='file'
          onClick={(e) => {
            e.stopPropagation()
            // we need this to enable choosing the same file more than once in a row:
            e.target.value = EMPTY_STRING
          }}
          onChange={(e) => onFileChange(e.target.files[0])}
          {...rest}
        />
        <label
          htmlFor={id}
          className='button small'
          onClick={(e) => e.stopPropagation()}
        >
          {label}
        </label>
        <span className='upload-field-error capitalize-first-letter'>
          {error}
        </span>
        {fileName && (
          <div className='file-name-wrapper'>
            <SpanTooltip extraClasses='file-name'>{fileName}</SpanTooltip>
            <IconButton
              onClick={() => {
                setFileName(EMPTY_STRING)
                onChange(EMPTY_STRING)
              }}
            >
              <Close />
            </IconButton>
          </div>
        )}
      </div>
    </Tooltip>
  )
}
export default UploadField
