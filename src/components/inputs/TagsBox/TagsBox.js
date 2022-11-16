import React, { useEffect, useState } from 'react'
import propTypes from 'prop-types'
import CreatableSelect from 'react-select/creatable'
import { FormControl } from '@mui/material'
import classNames from 'classnames'
import { EMPTY_STRING, TAG_SEPARATOR } from '../../../consts'
import Utils from '../../../utils'
import Tooltip from '../../Tooltip'
import { Info } from '../../../svgs'

import './tagsBox.scss'

function TagsBox(props) {
  const {
    label, onChange, value, error, placeholder, wrapperClass, tagsValidation,
    warning, isRequired, info, invalidTagText, disabled, isClearable, ...rest
  } = props
  const [editValue, setEditValue] = useState(EMPTY_STRING)
  const [editValueError, setEditErrorValue] = useState(false)
  const [displayValue, setDisplayValue] = useState([])
  useEffect(() => {
    setDisplayValue(value?.map(Utils.formatOption))
  }, [value])

  useEffect(() => {
    if (editValueError) {
      setEditErrorValue(false)
    }
  }, [editValue])

  const wrapperClasses = classNames({
    [wrapperClass]: true,
    'tagsbox-wrapper': true,
    'has-error': !!error
  })

  function onKeyDown(event) {
    const triggerKey = new Set([TAG_SEPARATOR, 'Enter'])
    if (triggerKey.has(event.key)) {
      if (editValue) {
        event.preventDefault()
      }
      const deDuplicateValues = Array.from(new Set(
        `${value}${TAG_SEPARATOR}${editValue}`
          .split(TAG_SEPARATOR)
          .filter((tag) => tag)
      ))
      if (Utils.isEmpty(tagsValidation([editValue]))) {
        setEditErrorValue(true)
      } else {
        onChange(tagsValidation(deDuplicateValues))
        setEditValue(EMPTY_STRING)
      }
    }
  }

  function onMouseClick(event) {
    event.stopPropagation()
    const deDuplicateValues = Array.from(new Set(
      `${value}${TAG_SEPARATOR}${editValue}`
        .split(TAG_SEPARATOR)
        .filter((tag) => tag)
    ))
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
        {!!info && <Tooltip data={info}><Info /></Tooltip>}
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
          <div onClick={onMouseClick}>
            {`'${userInput}'`}
            {editValueError && <span className='tags-invalid'>{` - ${invalidTagText || 'Invalid value'}`}</span>}
          </div>
        )}
        classNamePrefix='react-tagsbox'
        {...rest}
      />
      <span className='tags-box-error capitalize-first-letter'>{editValueError || error}</span>
      {value && !error && warning && (
        <span className='tags-warning'>
          {warning}
        </span>
      )}
    </FormControl>

  )
}

TagsBox.defaultProps = {
  onChange: () => {
  },
  value: [],
  error: EMPTY_STRING,
  warning: EMPTY_STRING,
  placeholder: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  isRequired: false,
  label: EMPTY_STRING,
  tagsValidation: (tags) => tags,
  info: EMPTY_STRING,
  invalidTagText: EMPTY_STRING,
  disabled: false,
  isClearable: true

}

TagsBox.propTypes = {
  onChange: propTypes.func,
  value: propTypes.any,
  wrapperClass: propTypes.string,
  warning: propTypes.string,
  isRequired: propTypes.bool,
  tagsValidation: propTypes.func,
  placeholder: propTypes.oneOfType([propTypes.string, propTypes.number]),
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  error: propTypes.any,
  info: propTypes.any,
  invalidTagText: propTypes.string,
  disabled: propTypes.bool,
  isClearable: propTypes.bool
}

export default TagsBox
