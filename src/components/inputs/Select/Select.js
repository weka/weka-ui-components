/*eslint-disable*/
import React, { useEffect, useState } from 'react'
import { FormControl } from '@mui/material'
import ReactSelect from 'react-select'
import propTypes from 'prop-types'
import classNames from 'classnames'
import Tooltip from '../../Tooltip'
import { EMPTY_STRING } from '../../../consts'
import SelectOption from './SelectOption'
import SingleValue from './SingleValue'
import MultiValue from './MultiValue'
import ClearIndicator from './ClearIndicator'
import Utils from '../../../utils'
import { Info } from '../../../svgs'

import './select.scss'

const getStyle = (hasError, hasLabel) => ({
  menuPortal: (provided, state) => {
    return ({ ...provided, zIndex: 9999, top: state.offset === state.rect.top ?  state.offset + 6 : state.offset - 6 })
  },
  menu: (base) => ({
    ...base,
    boxShadow: '0 0 0 2px var(--main-color)',
    backgroundColor: 'var(--neutral-t4)'
  }),
  control: (base, state) => ({
    ...base,
    height: (hasLabel ? 48 : 32),
    minHeight: (hasLabel ? 48 : 32),
    ...(hasError
      ? { boxShadow: '0 0 0 1px var(--focus-key)' } : { boxShadow: state.isFocused ? '0 0 0 1px var(--main-color)' : 0 }),
    ...(hasError
      ? {
        borderColor: 'var(--focus-key)',
        '&:hover': { borderColor: 'state.isFocused' }
      }
      : {
        borderColor: state.isFocused
          ? 'var(--main-color)'
          : 'var(--ironhide-t1)',
        '&:hover': {
          borderColor: state.isFocused
            ? 'var(--main-color)'
            : 'var(--ironhide-t1)'
        }
      })
  }),
  clearIndicator: (base, { isDisabled }) => ({
    ...base,
    cursor: 'pointer',
    color: isDisabled ? 'var(--ironhide-key)' : 'var(--main-color)',
    ':hover': { color: isDisabled ? 'var(--ironhide-key)' : 'var(--main-color)' }
  }),
  indicatorSeparator: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--main-color)' : 'var(--ironhide-t1)'
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isDisabled ? 'var(--ironhide-key)' : 'var(--main-color)',
    ':hover': { color: state.isDisabled ? 'var(--ironhide-key)' : 'var(--main-color)' },
    '>svg': { transform: state.selectProps.menuIsOpen && 'rotate(180deg)' }
  }),
  option: (base, { isDisabled }) => ({
    ...base,
    color: 'var(--text-color)',
    opacity: isDisabled && '.5',
    backgroundColor: isDisabled ? 'transparent' : 'var(--neutral-t4)',
    ':hover': { backgroundColor: isDisabled ? 'transparent' : 'var(--ironhide-t3)' }
  })
})

function Select(props) {
  const {
    onChange, options, value, wrapperClass, isMulti, label,
    disabled, sortOptions, error, placeholder, info, isRequired, redInfo, isClearable, ...rest
  } = props
  const [saveOptions, setSaveOptions] = useState(null)

  useEffect(() => { // this is for a case that the options change while modal open
    setSaveOptions(sortOptions ? Utils.insensitiveSort(options, 'label') : options)
    if (isMulti) {
      if (value) {
        const valuesInOptions = value.filter((val) => options.find((option) => option.value === val))
        if (Utils.isEmpty(valuesInOptions)) {
          onChange(EMPTY_STRING)
        } else if (valuesInOptions.length !== value.length) {
          onChange(valuesInOptions)
        }
      }
    } else if (value && !options.find((option) => option.value === value)) {
      onChange(EMPTY_STRING)
    }
  }, [JSON.stringify(options)])

  function onSelectChange(data) {
    if (!isMulti) {
      const { value: newValue } = data
      onChange(newValue)
    } else {
      onChange(data.map((option) => option.value))
    }
  }

  const wrapperClasses = classNames({
    'select-wrapper': true,
    [wrapperClass]: true,
    'select-wrapper-is-multi': isMulti,
    'has-error': error,
    'no-label': !label
  })

  return (
    <FormControl variant='outlined' className={wrapperClasses}>
      <span className='select-label field-1-label-content'>
        {label}
        {isRequired && <span className='required-star'>*</span>}
        {!!info && <Tooltip data={info}><Info /></Tooltip>}
      </span>
      <ReactSelect
        {...rest}
        menuPosition='fixed'
        isDisabled={disabled}
        styles={getStyle(!!error, !!label)}
        /* eslint-disable-next-line no-nested-ternary */
        value={isMulti
          ? (value ? value.map((val) => options.find((option) => option.value === val)) : EMPTY_STRING)
          : options.find((option) => option.value === value) || EMPTY_STRING}
        options={saveOptions}
        autosize
        isMulti={isMulti}
        isClearable={isMulti && isClearable}
        onChange={onSelectChange}
        classNamePrefix='react-select'
        dropdownAlign={{ offset: [0, 0] }}
        components={{
          Option: SelectOption,
          SingleValue,
          MultiValue,
          ClearIndicator
        }}
        menuPortalTarget={document.body}
        closeMenuOnSelect={!isMulti}
        placeholder={placeholder || 'Select...'}
      />
      <span className='select-error capitalize-first-letter'>{error || redInfo(value)}</span>
    </FormControl>
  )
}

Select.defaultProps = {
  onChange: () => {
  },
  value: EMPTY_STRING,
  label: EMPTY_STRING,
  info: EMPTY_STRING,
  wrapperClass: EMPTY_STRING,
  isMulti: false,
  sortOptions: false,
  error: EMPTY_STRING,
  disabled: false,
  isRequired: false,
  placeholder: EMPTY_STRING,
  redInfo: () => {},
  isClearable: true
}

Select.propTypes = {
  onChange: propTypes.func,
  isMulti: propTypes.bool,
  sortOptions: propTypes.bool,
  disabled: propTypes.bool,
  isRequired: propTypes.bool,
  value: propTypes.any,
  info: propTypes.any,
  wrapperClass: propTypes.string,
  error: propTypes.any,
  label: propTypes.oneOfType([propTypes.string, propTypes.object]),
  options: propTypes.array.isRequired,
  redInfo: propTypes.func,
  placeholder: propTypes.string,
  isClearable: propTypes.bool
}

export default Select
