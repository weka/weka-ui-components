import React, { MouseEvent, ReactElement, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { FormControl } from '@mui/material'
import { BACKSPACE, EMPTY_STRING, ENTER, NOP } from '../../../consts'
import clsx from 'clsx'
import Tooltip from '../../Tooltip'
import { Info } from '../../../svgs'
import SelectOption from '../Select/SelectOption'
import SingleValue from '../Select/SingleValue'
import ClearIndicator from '../Select/ClearIndicator'
import MenuList from '../Select/MenuList'
import { getStyle } from '../Select/Select'
import Utils from '../../../utils'

import './customizableSelect.module.scss'

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
}

function CustomizableSelect(props: CustomizableSelectProps) {
  const {
    onChange = NOP,
    options,
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
    ...rest
  } = props
  const [editValue, setEditValue] = useState(EMPTY_STRING)
  const [isMenuOpen, setMenuIsOpen] = useState(false)

  const onMouseClick = (event: MouseEvent, userInput: string) => {
    event.stopPropagation()
    if (customValueValidation(userInput)) {
      onChange(userInput)
      setMenuIsOpen(false)
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === ENTER) {
      event.preventDefault()
      if (!!editValue && customValueValidation(editValue)) {
        onChange(editValue)
        setMenuIsOpen(false)
      }
    }
    if (event.key === BACKSPACE && editValue.length === 1) {
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
    'no-label': !label
  })
  return (
    <FormControl variant='outlined' className={wrapperClasses}>
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
        menuPosition='fixed'
        createOptionPosition='first'
        styles={getStyle(!!error, !!label)}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        menuIsOpen={isMenuOpen}
        value={
          options.find((option) => option.value === value) ||
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
        onChange={(newVal) => onChange(newVal?.value)}
        options={
          sortOptions ? Utils.insensitiveSort(options, 'label') : options
        }
        classNamePrefix='react-creatable-select'
        components={{
          Option: SelectOption,
          SingleValue,
          ClearIndicator,
          MenuList
        }}
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
  )
}

export default CustomizableSelect
