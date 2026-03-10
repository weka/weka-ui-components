import type { ReactElement, ReactNode } from 'react'
import React, { useId, useState } from 'react'
import { IconButton } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING, ENCODING_TYPES, NOP } from 'consts'
import svgs from 'svgs'

import Info from '../../Info'
import SpanTooltip from '../../SpanTooltip'
import Tooltip from '../../Tooltip'

import './uploadField.scss'

const { Close } = svgs

interface UploadFieldProps {
  onChange?: (newVal: any) => void
  onReadError?: (error?: Error) => void
  onClear?: (e: React.MouseEvent<HTMLButtonElement>) => void
  wrapperClass?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  tooltipText?: string
  encoding: keyof typeof ENCODING_TYPES
  info?: ReactElement | string
  isRequired?: boolean
  description?: ReactNode
}
function UploadField({
  label,
  onChange = NOP,
  onClear = NOP,
  disabled,
  wrapperClass = EMPTY_STRING,
  placeholder,
  error,
  onReadError,
  tooltipText = EMPTY_STRING,
  encoding = ENCODING_TYPES.text,
  info,
  isRequired,
  description,
  ...rest
}: UploadFieldProps) {
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
        {description ? (
          <span className='field__description-wrap'>
            <span className='field__description field-1-description-content'>
              {description}
              {isRequired ? <span className='required-star'>*</span> : null}
              {!!info && (
                <Info
                  data={info}
                  extraClass='upload-field-info-icon'
                />
              )}
            </span>
          </span>
        ) : null}
        <input
          disabled={disabled}
          id={id}
          onChange={(e) => onFileChange(e.target.files[0])}
          placeholder={placeholder}
          type='file'
          onClick={(e) => {
            e.stopPropagation()
            // we need this to enable choosing the same file more than once in a row:
            e.target.value = EMPTY_STRING
          }}
          {...rest}
        />
        <label
          className='button small'
          htmlFor={id}
          onClick={(e) => e.stopPropagation()}
        >
          {label}
          {isRequired && !disabled && !description ? (
            <span className='required-star'>*</span>
          ) : null}
        </label>
        <span className='upload-field-info'>
          {!!info && !description && (
            <Info
              data={info}
              extraClass='upload-field-info-icon'
            />
          )}
        </span>
        <span className='upload-field-error capitalize-first-letter'>
          {error}
        </span>
        {fileName ? (
          <div className='file-name-wrapper'>
            <SpanTooltip extraClasses='file-name'>{fileName}</SpanTooltip>
            <IconButton
              onClick={(e) => {
                onClear(e)
                setFileName(EMPTY_STRING)
                onChange(EMPTY_STRING)
              }}
            >
              <Close />
            </IconButton>
          </div>
        ) : null}
      </div>
    </Tooltip>
  )
}
export default UploadField
