import type { KeyboardEvent, MouseEvent, ReactElement } from 'react'
import React, { useEffect, useState } from 'react'
import { type MenuPosition, type MultiValue } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { FormControl } from '@mui/material'
import clsx from 'clsx'
import type Option from 'types'

import { EMPTY_STRING, EVENT_KEYS, TAG_SEPARATOR } from 'consts'
import svgs from 'svgs'
import Utils from 'utils'

import { useHighlightInput } from '../../../hooks'
import Tooltip from '../../Tooltip'

import './tagsBox.scss'

const { Info } = svgs

export interface TagsBoxProps {
  onChange: (newVal: any) => void
  value: any
  wrapperClass?: string
  warning?: string
  isRequired?: boolean
  tagsValidation?: (val: string[]) => string[]
  placeholder?: string | number
  label: string | ReactElement
  error?: any
  info?: any
  invalidTagText?: string
  disabled?: boolean
  isClearable?: boolean
  menuPortalTarget?: HTMLElement
  menuPosition?: MenuPosition
  expandInputOnFocus?: boolean
  isHighlighted?: boolean
  isScrolledInto?: boolean
}

function TagsBox({
  label,
  onChange,
  value = [],
  error,
  placeholder,
  wrapperClass = EMPTY_STRING,
  tagsValidation = (val) => val,
  warning,
  isRequired,
  info,
  invalidTagText,
  disabled,
  isClearable,
  expandInputOnFocus = true,
  isHighlighted,
  isScrolledInto,
  ...rest
}: TagsBoxProps) {
  const [editValue, setEditValue] = useState(EMPTY_STRING)
  const [editValueError, setEditErrorValue] = useState(false)
  const [displayValue, setDisplayValue] = useState([])
  const tagsBoxRef = React.useRef<HTMLInputElement | null>(null)
  const highlighted = useHighlightInput({
    inputRef: tagsBoxRef,
    isHighlighted,
    isScrolledInto
  })
  useEffect(() => {
    setDisplayValue(value?.map(Utils.formatOption))
  }, [JSON.stringify(value)])

  useEffect(() => {
    if (editValueError) {
      setEditErrorValue(false)
    }
  }, [editValue])

  const wrapperClasses = clsx({
    [wrapperClass]: true,
    'tagsbox-wrapper': true,
    'has-error': !!error,
    'expand-input-on-focus': expandInputOnFocus,
    'is-highlighted': highlighted
  })

  function onKeyDown(event: KeyboardEvent) {
    const triggerKey = new Set([TAG_SEPARATOR, EVENT_KEYS.ENTER])
    if (triggerKey.has(event.key)) {
      if (editValue) {
        event.preventDefault()
      }
      const deDuplicateValues = Array.from(
        new Set(
          `${value}${TAG_SEPARATOR}${editValue}`
            .split(TAG_SEPARATOR)
            .filter((tag) => tag)
        )
      )
      if (Utils.isEmpty(tagsValidation([editValue]))) {
        setEditErrorValue(true)
      } else {
        onChange(tagsValidation(deDuplicateValues))
        setEditValue(EMPTY_STRING)
      }
    }
  }

  function onMouseClick(event: MouseEvent) {
    event.stopPropagation()
    const deDuplicateValues = Array.from(
      new Set(
        `${value}${TAG_SEPARATOR}${editValue}`
          .split(TAG_SEPARATOR)
          .filter((tag) => tag)
      )
    )
    if (Utils.isEmpty(tagsValidation([editValue]))) {
      setEditErrorValue(true)
    } else {
      onChange(tagsValidation(deDuplicateValues))
      setEditValue(EMPTY_STRING)
    }
  }

  function onChangeWrapper(newValue: MultiValue<Option>) {
    onChange(newValue.map((val) => val.label))
  }

  return (
    <FormControl
      ref={tagsBoxRef}
      className={wrapperClasses}
    >
      <span className='tags-label field-1-label-content'>
        {label}
        {isRequired ? <span className='required-star'>*</span> : null}
        {!!info && (
          <Tooltip data={info}>
            <Info />
          </Tooltip>
        )}
      </span>
      <CreatableSelect
        classNamePrefix='react-tagsbox'
        components={{ DropdownIndicator: null }}
        inputValue={editValue}
        isClearable={isClearable}
        isDisabled={disabled}
        isMulti
        noOptionsMessage={() => null}
        onChange={onChangeWrapper}
        onInputChange={setEditValue}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        value={displayValue}
        formatCreateLabel={(userInput) => (
          <div
            className='tags-user-input-preview'
            onClick={onMouseClick}
          >
            {`'${userInput}'`}
            {editValueError ? (
              <span className='tags-invalid'>
                {` - ${invalidTagText || 'Invalid value'}`}
              </span>
            ) : null}
          </div>
        )}
        {...rest}
      />
      <span className='tags-box-error capitalize-first-letter'>
        {editValueError || error}
      </span>
      {value && !error && warning ? (
        <span className='tags-warning'>{warning}</span>
      ) : null}
    </FormControl>
  )
}

export default TagsBox
