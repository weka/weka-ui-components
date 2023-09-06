import React, {
  ReactElement,
  MouseEvent,
  KeyboardEvent,
  useEffect,
  useState
} from 'react'
import CreatableSelect from 'react-select/creatable'
import { FormControl } from '@mui/material'
import clsx from 'clsx'
import { EMPTY_STRING, TAG_SEPARATOR } from '../../../consts'
import Utils from '../../../utils'
import Tooltip from '../../Tooltip'
import { Info } from '../../../svgs'

import './tagsBox.scss'

interface TagsBoxProps {
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
}

function TagsBox(props: TagsBoxProps) {
  const {
    label,
    onChange,
    value = [],
    error,
    placeholder,
    wrapperClass = '',
    tagsValidation = (val) => val,
    warning,
    isRequired,
    info,
    invalidTagText,
    disabled,
    isClearable,
    ...rest
  } = props
  const [editValue, setEditValue] = useState(EMPTY_STRING)
  const [editValueError, setEditErrorValue] = useState(false)
  const [displayValue, setDisplayValue] = useState([])
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
    'has-error': !!error
  })

  function onKeyDown(event: KeyboardEvent) {
    const triggerKey = new Set([TAG_SEPARATOR, 'Enter'])
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

  function onChangeWrapper(data) {
    onChange(data.map((val) => val.label))
  }

  return (
    <FormControl className={wrapperClasses}>
      <span className='tags-label field-1-label-content'>
        {label}
        {isRequired && <span className='required-star'>*</span>}
        {!!info && (
          <Tooltip data={info}>
            <Info />
          </Tooltip>
        )}
      </span>
      <CreatableSelect
        components={{ DropdownIndicator: null }}
        inputValue={editValue}
        isClearable={isClearable}
        isMulti
        isDisabled={disabled}
        onChange={onChangeWrapper}
        onInputChange={setEditValue}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        noOptionsMessage={() => null}
        value={displayValue}
        formatCreateLabel={(userInput) => (
          <div onClick={onMouseClick} className='tags-user-input-preview'>
            {`'${userInput}'`}
            {editValueError && (
              <span className='tags-invalid'>{` - ${
                invalidTagText || 'Invalid value'
              }`}</span>
            )}
          </div>
        )}
        classNamePrefix='react-tagsbox'
        {...rest}
      />
      <span className='tags-box-error capitalize-first-letter'>
        {editValueError || error}
      </span>
      {value && !error && warning && (
        <span className='tags-warning'>{warning}</span>
      )}
    </FormControl>
  )
}
export default TagsBox
