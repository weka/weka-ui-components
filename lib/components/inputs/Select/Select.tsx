import React, {
  ReactElement,
  useEffect,
  useState,
  useMemo,
  useRef
} from 'react'
import { FormControl } from '@mui/material'
import ReactSelect from 'react-select'
import clsx from 'clsx'
import { EMPTY_STRING, NOP } from 'consts'
import SelectOption from './SelectOption'
import SingleValue from './SingleValue'
import MultiValue from './MultiValue'
import ClearIndicator from './ClearIndicator'
import Utils from 'utils'
import svgs from 'svgs'
import Tooltip from '../../Tooltip'
import VirtualMenuList from './VirtualMenuList'
import InputLoader from '../../InputLoader'
import { useHighlightInput } from '../../../hooks'

import './select.scss'

const { Info } = svgs

export const getStyle = (hasError, hasLabel) => ({
  menuPortal: (provided, state) => {
    return {
      ...provided,
      zIndex: 1500,
      top: state.offset === state.rect.top ? state.offset + 6 : state.offset - 6
    }
  },
  menu: (base) => ({
    ...base,
    boxShadow: '0 0 0 2px var(--main-color)',
    backgroundColor: 'var(--neutral-t4)'
  }),
  menuList: (base) => ({
    ...base,
    height: '100%',
    maxHeight: '300px'
  }),
  control: (base, state) => ({
    ...base,
    height: hasLabel ? 48 : 32,
    minHeight: hasLabel ? 48 : 32,
    ...(hasError
      ? { boxShadow: '0 0 0 1px var(--focus-key)' }
      : { boxShadow: state.isFocused ? '0 0 0 1px var(--main-color)' : 0 }),
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
    ':hover': {
      color: isDisabled ? 'var(--ironhide-key)' : 'var(--main-color)'
    }
  }),
  indicatorSeparator: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? 'var(--main-color)'
      : 'var(--ironhide-t1)'
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isDisabled ? 'var(--ironhide-key)' : 'var(--main-color)',
    ':hover': {
      color: state.isDisabled ? 'var(--ironhide-key)' : 'var(--main-color)'
    },
    '>svg': { transform: state.selectProps.menuIsOpen && 'rotate(180deg)' }
  }),
  option: (base, { isDisabled }) => ({
    ...base,
    willChange: 'transform',
    color: 'var(--text-color)',
    opacity: isDisabled && '.5',
    backgroundColor: isDisabled ? 'transparent' : 'var(--neutral-t4)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '8px 12px',
    ':hover': {
      backgroundColor: isDisabled ? 'transparent' : 'var(--ironhide-t3)'
    }
  })
})

export interface SelectProps {
  onChange?: (newVal: any) => void
  isMulti?: boolean
  sortOptions?: boolean
  disabled?: boolean
  isRequired?: boolean
  value?: any
  info?: any
  wrapperClass?: string
  error?: string
  label?: string | ReactElement
  options: any[]
  redInfo?: any
  placeholder?: string
  isClearable?: boolean
  autoFocus?: boolean
  groupedOptions?: boolean
  isSingleClearable?: boolean
  expandInputOnFocus?: boolean
  getAsyncOptions?: (optionsUrl?: string) => Promise<Option[]>
  optionsUrl?: string
  tooltip?: string | ReactElement
  defaultValueIndex?: number
  defaultValueKey?: string
  preventCall?: boolean
  isHighlighted?: boolean
  isScrolledInto?: boolean
}

export const CommonSelectComponents = {
  Option: SelectOption,
  SingleValue,
  ClearIndicator,
  MenuList: VirtualMenuList,
  LoadingIndicator: InputLoader
}

function Select(props: SelectProps) {
  const {
    onChange = NOP,
    options,
    value,
    wrapperClass = EMPTY_STRING,
    isMulti,
    label,
    disabled,
    sortOptions,
    error,
    placeholder = 'Select...',
    info,
    isRequired,
    redInfo = NOP,
    isSingleClearable = false,
    isClearable = true,
    autoFocus = false,
    groupedOptions = false,
    expandInputOnFocus,
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
  const isAsync = !!getAsyncOptions
  const [saveOptions, setSaveOptions] = useState<Option[] | null>(null)
  const selectRef = useRef<HTMLInputElement | null>(null)
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
      optionsFunc.then((asyncOptions) => {
        initialOptionsSetup(asyncOptions)
        if (!Utils.isEmpty(defaultValueIndex)) {
          onChange(asyncOptions[defaultValueIndex].value)
        } else if (!Utils.isEmpty(defaultValueKey)) {
          onChange(
            asyncOptions.find((option) => option.value === defaultValueKey)
              ?.value || EMPTY_STRING
          )
        }
      })
    } else {
      initialOptionsSetup(options)
    }
  }, [JSON.stringify(options), optionsUrl, preventCall])

  const formattedGroupedOptions = useMemo(() => {
    if (groupedOptions) {
      return options.reduce((acc, { options }) => {
        options.forEach(({ label, value }) =>
          acc.push(Utils.formatOption(label, value))
        )
        return acc
      }, [])
    }
    return []
  }, [JSON.stringify(options)])

  // this is for a case that the options change while modal is open:
  function initialOptionsSetup(currentOptions: Option[]) {
    setSaveOptions(
      sortOptions
        ? Utils.insensitiveSort(currentOptions, 'label')
        : currentOptions
    )
    if (isMulti) {
      if (value) {
        const valuesInOptions = value.filter((val: string | number) => {
          if (groupedOptions) {
            return formattedGroupedOptions.find(
              (option) => option.value === val
            )
          }
          return currentOptions.find((option) => option.value === val)
        })
        if (Utils.isEmpty(valuesInOptions)) {
          onChange([])
        } else if (valuesInOptions.length !== value.length) {
          onChange(valuesInOptions)
        }
      }
    } else if (
      value &&
      !currentOptions.find((option) => option.value === value)
    ) {
      onChange(EMPTY_STRING)
    }
  }

  function onSelectChange(data) {
    if (!isMulti) {
      if (data) {
        const { value: newValue } = data
        onChange(newValue)
      } else {
        onChange(EMPTY_STRING)
      }
    } else {
      onChange(data.map((option: Option) => option.value))
    }
  }

  const currentValue = useMemo(() => {
    const currentOptions = isAsync ? saveOptions : options
    if (isMulti) {
      if (value && currentOptions) {
        return value.map((val: string | number) => {
          if (groupedOptions) {
            return formattedGroupedOptions.find(
              (option) => option.value === val
            )
          }
          return currentOptions.find((option) => option.value === val)
        })
      }
      return EMPTY_STRING
    }
    if (groupedOptions) {
      return formattedGroupedOptions.find((option) => option.value === value)
    }
    return (
      currentOptions?.find((option) => option.value === value) || EMPTY_STRING
    )
  }, [isAsync, value, saveOptions])

  const wrapperClasses = clsx('select-wrapper', wrapperClass, {
    'select-wrapper-is-multi': isMulti,
    'has-error': error,
    'no-label': !label,
    'expand-input-on-focus': expandInputOnFocus,
    'is-highlighted': highlighted
  })

  return (
    <Tooltip data={tooltip}>
      <FormControl
        variant='outlined'
        className={wrapperClasses}
        ref={selectRef}
      >
        <span className='select-label field-1-label-content'>
          {label}
          {isRequired && <span className='required-star'>*</span>}
          {!!info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </span>
        <ReactSelect
          {...rest}
          isLoading={isAsync && !saveOptions}
          menuPosition='fixed'
          isDisabled={disabled}
          styles={getStyle(!!error, !!label)}
          autoFocus={autoFocus}
          value={currentValue}
          options={saveOptions || []}
          autosize
          isMulti={isMulti}
          isClearable={(isMulti && isClearable) || isSingleClearable}
          onChange={onSelectChange}
          classNamePrefix='react-select'
          dropdownAlign={{ offset: [0, 0] }}
          components={{ ...CommonSelectComponents, MultiValue }}
          menuPortalTarget={document.body}
          closeMenuOnSelect={!isMulti}
          placeholder={placeholder}
        />
        <span className='select-error capitalize-first-letter'>
          {error || redInfo(value)}
        </span>
      </FormControl>
    </Tooltip>
  )
}

export default Select
