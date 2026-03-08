import type { MouseEvent, ReactElement } from 'react'
import React, { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { FormControl } from '@mui/material'
import clsx from 'clsx'

import { EMPTY_STRING, EVENT_KEYS, NOP } from 'consts'
import svgs from 'svgs'
import Utils from 'utils'

import { useHighlightInput } from '../../../hooks'
import Tooltip from '../../Tooltip'
import { CommonSelectComponents, getStyle } from '../Select/Select'

import './customizableSelect.scss'

const { Info } = svgs

interface CustomizableSelectProps {
  onChange?: (newVal: unknown) => void
  sortOptions?: boolean
  disabled?: boolean
  isRequired?: boolean
  value?: unknown
  info?: string | ReactElement
  wrapperClass?: string
  error?: string
  label?: string | ReactElement
  options: Option[]
  redInfo?: (value: unknown) => string
  placeholder?: string
  isClearable?: boolean
  autoFocus?: boolean
  groupedOptions?: boolean
  customValueValidation?: (val: string) => boolean
  customValueError?: string
  createLabel?: string
  getAsyncOptions?: (optionsUrl?: string) => Promise<Option[]>
  optionsUrl?: string
  tooltip?: string | ReactElement
  defaultValueIndex?: number
  defaultValueKey?: string
  preventCall?: boolean
  isHighlighted?: boolean
  isScrolledInto?: boolean
}

function CustomizableSelect({
  onChange = NOP,
  options: localOptions,
  value,
  wrapperClass = EMPTY_STRING,
  label,
  disabled,
  sortOptions,
  error,
  placeholder = 'Select...',
  info,
  isRequired,
  redInfo = NOP,
  isClearable = true,
  customValueValidation = () => true,
  customValueError,
  createLabel = 'Create',
  getAsyncOptions,
  optionsUrl,
  tooltip,
  defaultValueIndex,
  defaultValueKey,
  preventCall,
  isHighlighted,
  isScrolledInto,
  ...rest
}: CustomizableSelectProps) {
  const [editValue, setEditValue] = useState(EMPTY_STRING)
  const [isMenuOpen, setMenuIsOpen] = useState(false)
  const [asyncOptions, setAsyncOptions] = useState(null)
  const isAsync = !!getAsyncOptions
  const [isLoadingOptions, setLoadingOptions] = useState(false)
  const options = isAsync ? asyncOptions : localOptions
  const selectRef = React.useRef<HTMLInputElement | null>(null)
  const highlighted = useHighlightInput({
    inputRef: selectRef,
    isHighlighted,
    isScrolledInto
  })

  useEffect(() => {
    if (isAsync && !preventCall) {
      const optionsFunc = optionsUrl
        ? getAsyncOptions(optionsUrl)
        : getAsyncOptions()
      onChange(value || EMPTY_STRING)
      setLoadingOptions(true)
      optionsFunc.then((asyncOptions) => {
        setAsyncOptions(asyncOptions)
        setLoadingOptions(false)
        if (!Utils.isEmpty(defaultValueIndex)) {
          onChange(asyncOptions[defaultValueIndex]?.value)
        } else if (!Utils.isEmpty(defaultValueKey)) {
          onChange(
            asyncOptions.find((option) => option.value === defaultValueKey)
              ?.value || EMPTY_STRING
          )
        }
      })
    }
  }, [optionsUrl, preventCall])

  const onMouseClick = (event: MouseEvent, userInput: string) => {
    event.stopPropagation()
    if (customValueValidation(userInput)) {
      onChange(userInput)
      setMenuIsOpen(false)
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === EVENT_KEYS.ENTER) {
      if (!!editValue && customValueValidation(editValue)) {
        event.preventDefault()
        onChange(editValue)
        setMenuIsOpen(false)
      }
    }
    if (event.key === EVENT_KEYS.BACKSPACE && editValue.length === 1) {
      onChange(EMPTY_STRING)
    }
  }

  useEffect(() => {
    if (!value) {
      setEditValue(EMPTY_STRING)
    }
  }, [value])

  const wrapperClasses = clsx({
    'creatable-select-wrapper': true,
    [wrapperClass]: true,
    'has-error': error,
    'no-label': !label,
    'is-highlighted': highlighted
  })
  return (
    <Tooltip data={tooltip}>
      <FormControl
        ref={selectRef}
        className={wrapperClasses}
        variant='outlined'
      >
        <span className='creatable-select-label field-1-label-content'>
          {label}
          {isRequired ? <span className='required-star'>*</span> : null}
          {!!info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </span>
        <CreatableSelect
          {...rest}
          classNamePrefix='react-creatable-select'
          components={CommonSelectComponents}
          createOptionPosition='first'
          inputValue={editValue}
          isClearable={isClearable}
          isDisabled={disabled}
          isLoading={isLoadingOptions && !editValue ? !value : null}
          menuIsOpen={isMenuOpen}
          menuPortalTarget={document.body}
          menuPosition='fixed'
          onInputChange={setEditValue}
          onKeyDown={onKeyDown}
          onMenuClose={() => setMenuIsOpen(false)}
          onMenuOpen={() => setMenuIsOpen(true)}
          placeholder={placeholder}
          styles={getStyle(!!error, !!label)}
          formatCreateLabel={(inputValue) => (
            <div
              className='new-option-input-preview'
              onClick={(event) => onMouseClick(event, inputValue)}
            >
              {`${createLabel} '${inputValue}'`}
              {!customValueValidation(inputValue) && (
                <span className='new-option-invalid'>
                  {` - ${customValueError || 'Invalid value'}`}
                </span>
              )}
            </div>
          )}
          onChange={(newVal: Option | null) => {
            const newValue = newVal?.value ?? EMPTY_STRING
            onChange(newValue)
          }}
          onCreateOption={(inputValue) => {
            if (customValueValidation(inputValue)) {
              onChange(inputValue)
            }
          }}
          options={
            sortOptions && options
              ? Utils.insensitiveSort(options, 'label')
              : options || []
          }
          value={
            options?.find((option) => option?.value === value) ||
            (value
              ? {
                  label: value,
                  value
                }
              : EMPTY_STRING)
          }
        />
        <span className='creatable-select-error capitalize-first-letter'>
          {error || redInfo(value)}
        </span>
      </FormControl>
    </Tooltip>
  )
}

export default CustomizableSelect
