import React, { useId, useState } from 'react'
import clsx from 'clsx'
import { IconButton } from '@mui/material'
import SpanTooltip from '../../SpanTooltip'
import { EMPTY_STRING, NOP } from 'consts'
import { Close } from 'svgs'
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
  encoding: 'text' | 'binary' | 'base64'
}
function UploadField(props: UploadFieldProps) {
  const {
    label,
    onChange = NOP,
    disabled,
    wrapperClass = EMPTY_STRING,
    placeholder,
    error,
    onReadError,
    tooltipText = EMPTY_STRING,
    encoding,
    ...rest
  } = props
  const id = useId()
  const [fileName, setFileName] = useState(EMPTY_STRING)
  const uploadWrapperClasses = clsx({
    'upload-wrapper': true,
    [wrapperClass]: true,
    'upload-wrapper-disabled': disabled
  })

  const onFileChange = (file: File) => {
    if (encoding === 'binary') {
      onChange(file)
      return
    }

    try {
      const isText = encoding === 'text'
      const reader = new FileReader()

      reader.onload = (event: ProgressEvent<FileReader>) => {
        setFileName(file.name)
        const result = event.target?.result

        const value = isText
          ? (result as string)
          : (result as string).split(',')[1]

        onChange(value)
      }

      reader.onerror = () => {
        onReadError?.()
      }

      isText ? reader.readAsText(file) : reader.readAsDataURL(file)
    } catch (e) {
      onReadError?.()
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
