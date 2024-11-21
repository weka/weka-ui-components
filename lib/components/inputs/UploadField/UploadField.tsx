import React, { ReactElement, useId, useState } from 'react'
import clsx from 'clsx'
import { IconButton } from '@mui/material'
import SpanTooltip from '../../SpanTooltip'
import { EMPTY_STRING, NOP } from 'consts'
import { Close, Info } from 'svgs'
import Tooltip from '../../Tooltip'

import './uploadField.scss'
const ENCODING_TYPES = { text: 'text', binary: 'binary', base64: 'base64' }

interface UploadFieldProps {
  onChange?: (newVal: any) => void
  onReadError?: (error?: Error) => void
  wrapperClass?: string
  placeholder?: string
  label?: string | ReactElement
  error?: string
  disabled?: boolean
  tooltipText?: string
  encoding: keyof typeof ENCODING_TYPES
  info?: any
  isRequired?: boolean
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
    info,
    isRequired,
    ...rest
  } = props
  const id = useId()
  const [fileName, setFileName] = useState(EMPTY_STRING)
  const uploadWrapperClasses = clsx('upload-wrapper', wrapperClass, {
    'upload-wrapper-disabled': disabled
  })

  const onFileChange = (file: File) => {
    if (file.size === 0) {
      onReadError?.(new Error('File is empty'))
      return
    }
    if (encoding === ENCODING_TYPES.binary) {
      onChange(file)
      return
    }

    try {
      const isText = encoding === ENCODING_TYPES.text
      const reader = new FileReader()

      reader.onload = (event: ProgressEvent<FileReader>) => {
        setFileName(file.name)
        const result = event.target?.result as string | null

        if (!result) {
          onReadError?.(new Error('Failed to read file content'))
          return
        }

        const value = isText ? result : result?.split(',')[1]

        onChange(value)
      }

      reader.onerror = () => {
        onReadError?.(new Error('Something went wrong'))
      }

      isText ? reader.readAsText(file) : reader.readAsDataURL(file)
    } catch (error) {
      onReadError?.(error as Error)
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
          {isRequired && <span className='required-star'>*</span>}
        </label>

        <span className='upload-field-info'>
          {!!info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </span>

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
