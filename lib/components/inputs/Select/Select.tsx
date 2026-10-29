import type { ReactElement } from 'react'
import type {
  MultiValue as SelectedOptions,
  SingleValue as SelectedOption,
  StylesConfig
} from 'react-select'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactSelect, { createFilter } from 'react-select'
import { FormControl } from '@mui/material'
import clsx from 'clsx'
import { EMPTY_STRING, NOP } from '#consts'
import svgs from '#svgs'
import Utils from '#utils'

import { useHighlightInput } from '#hooks'

import InputLoader from '../../InputLoader'
import Tooltip from '../../Tooltip'
import ClearIndicator from './ClearIndicator'
import MultiValue from './MultiValue'
import SelectOption from './SelectOption'
import SingleValue from './SingleValue'
import VirtualMenuList from './VirtualMenuList'

import './select.scss'

const { Info } = svgs

const MENU_PORTAL_GAP = 6

const filterOption = createFilter<Option>({
  stringify: ({ label, value, data }) =>
    `${label} ${value} ${data.subLabel ?? EMPTY_STRING}`
})

export const getStyle = (
  hasError: boolean,
  hasLabel: boolean
): StylesConfig<Option, boolean> => ({
  menuPortal: (provided, state) => {
    // react-select types `rect` as { left, width }, but passes a full DOMRect
    const { top } = state.rect as DOMRect
    return {
      ...provided,
      zIndex: 1500,
      top:
        state.offset === top
          ? state.offset + MENU_PORTAL_GAP
          : state.offset - MENU_PORTAL_GAP
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
      : {
          boxShadow: state.isFocused ? '0 0 0 1px var(--main-color)' : 'none'
        }),
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
  clearIndicator: (base, { selectProps: { isDisabled } }) => ({
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
    '>svg': {
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : undefined
    }
  }),
  option: (base, { isDisabled }) => ({
    ...base,
    willChange: 'transform',
    color: 'var(--text-color)',
    opacity: isDisabled ? '.5' : undefined,
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

function Select({
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
}: SelectProps) {
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
        if (
          defaultValueIndex !== undefined &&
          !Utils.isEmpty(defaultValueIndex)
        ) {
          onChange(asyncOptions[defaultValueIndex]?.value)
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
      return options.reduce<Option[]>(
        (acc, { options }: { options: Option[] }) => {
          options.forEach(({ label, value }) =>
            acc.push(Utils.formatOption(label, value))
          )
          return acc
        },
        []
      )
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

  function onSelectChange(
    data: SelectedOptions<Option> | SelectedOption<Option>
  ) {
    if (!isMulti) {
      if (data) {
        const { value: newValue } = data as Option
        onChange(newValue)
      } else {
        onChange(EMPTY_STRING)
      }
    } else {
      onChange((data as SelectedOptions<Option>).map((option) => option.value))
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
        ref={selectRef}
        className={wrapperClasses}
        variant='outlined'
      >
        <span className='select-label field-1-label-content'>
          {label}
          {isRequired ? <span className='required-star'>*</span> : null}
          {!!info && (
            <Tooltip data={info}>
              <Info />
            </Tooltip>
          )}
        </span>
        <ReactSelect
          filterOption={filterOption}
          {...rest}
          autoFocus={autoFocus}
          classNamePrefix='react-select'
          closeMenuOnSelect={!isMulti}
          components={{ ...CommonSelectComponents, MultiValue }}
          isClearable={(isMulti && isClearable) || isSingleClearable}
          isDisabled={disabled}
          isLoading={isAsync ? !saveOptions : undefined}
          isMulti={isMulti}
          menuPortalTarget={document.body}
          menuPosition='fixed'
          onChange={onSelectChange}
          options={saveOptions || []}
          placeholder={placeholder}
          styles={getStyle(!!error, !!label)}
          value={currentValue}
        />
        <span className='select-error capitalize-first-letter'>
          {error || redInfo(value)}
        </span>
      </FormControl>
    </Tooltip>
  )
}

export default Select
