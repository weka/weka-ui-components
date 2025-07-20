import React, { MouseEvent, ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { FormControl } from '@mui/material'
import { EMPTY_STRING, EVENT_KEYS, NOP } from 'consts'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import svgs from 'svgs'
import { CommonSelectComponents, getStyle } from '../Select/Select'
import Utils from 'utils'
import { useHighlightInput } from '../../../hooks'

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

function CustomizableSelect(props: CustomizableSelectProps) {
  const {
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
  } = props
  const [editValue, setEditValue] = useState(EMPTY_STRING)
  const [isMenuOpen, setMenuIsOpen] = useState(false)
  const [asyncOptions, setAsyncOptions] = useState(null)
  const isAsync = !!getAsyncOptions
  const [isLoadingOptions, setLoadingOptions] = useState(false)
  const options = isAsync ? asyncOptions : localOptions
  const selectRef = React.useRef<HTMLInputElement | null>(null)
  const highlighted = useHighlightInput({ inputRef: selectRef, isHighlighted, isScrolledInto })

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
        variant='outlined'
        className={wrapperClasses}
        ref={selectRef}
      >
        <span className='creatable-select-label field-1-label-content'>
          {label}
          {isRequired && <span className='required-star'>*</span>}
          {!!info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </span>
        <CreatableSelect
          {...rest}
          isLoading={isLoadingOptions && !editValue && !value}
          menuPosition='fixed'
          createOptionPosition='first'
          styles={getStyle(!!error, !!label)}
          onMenuOpen={() => setMenuIsOpen(true)}
          onMenuClose={() => setMenuIsOpen(false)}
          menuIsOpen={isMenuOpen}
          value={
            options?.find((option) => option?.value === value) ||
            (value
              ? {
                  label: value,
                  value
                }
              : EMPTY_STRING)
          }
          isClearable={isClearable}
          inputValue={editValue}
          onInputChange={setEditValue}
          onCreateOption={(inputValue) => {
            if (customValueValidation(inputValue)) {
              onChange(inputValue)
            }
          }}
          onKeyDown={onKeyDown}
          isDisabled={disabled}
          placeholder={placeholder}
          menuPortalTarget={document.body}
          onChange={(newVal: Option | null) => {
            const newValue = newVal?.value ?? EMPTY_STRING
            onChange(newValue)
          }}
          options={
            sortOptions && options
              ? Utils.insensitiveSort(options, 'label')
              : options || []
          }
          classNamePrefix='react-creatable-select'
          components={CommonSelectComponents}
          formatCreateLabel={(inputValue) => (
            <div
              onClick={(event) => onMouseClick(event, inputValue)}
              className='new-option-input-preview'
            >
              {`${createLabel} '${inputValue}'`}
              {!customValueValidation(inputValue) && (
                <span className='new-option-invalid'>
                  {` - ${customValueError || 'Invalid value'}`}
                </span>
              )}
            </div>
          )}
        />
        <span className='creatable-select-error capitalize-first-letter'>
          {error || redInfo(value)}
        </span>
      </FormControl>
    </Tooltip>
  )
}

export default CustomizableSelect
