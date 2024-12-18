import React from 'react'
import clsx from 'clsx'
import { Control, Controller } from 'react-hook-form'
import Tooltip from '../../Tooltip'
import Select from '../../inputs/Select'
import TextBox from '../../inputs/TextBox'
import { EMPTY_STRING, FORM_VALIDATIONS } from 'consts'
import { Info } from 'svgs'
import Utils from 'utils'

import './controlInputs.scss'

interface ControlTextSelectValue {
  number: string | number
  unit: { value: string | number }
}

interface ControlTextSelectBoxProps {
  control: Control<Record<string, unknown>[]>
  name: string
  defaultValue?: ControlTextSelectValue
  rules?: Record<string, unknown>
  label?: string
  info?: string
  onChange?: (newValue: string | number) => void
  placeholder?: ControlTextSelectValue
  textType?: string
  options: Option[]
  disabled?: boolean
  allowDecimal?: boolean
  hideError?: boolean
  selectPlaceholder?: string | number
  wrapperClass?: string
}

function ControlTextSelectBox(props: ControlTextSelectBoxProps) {
  const {
    control,
    name,
    defaultValue = null,
    rules = {},
    label = EMPTY_STRING,
    placeholder = {},
    hideError = false,
    textType = EMPTY_STRING,
    options,
    disabled = false,
    selectPlaceholder = EMPTY_STRING,
    wrapperClass = EMPTY_STRING,
    onChange,
    info = EMPTY_STRING,
    allowDecimal = false
  } = props

  const formattedRules = { ...rules }
  if (rules.required) {
    const requiredFunc = (value) =>
      value.selectValue && !Utils.isEmpty(value.textValue)
        ? null
        : FORM_VALIDATIONS.REQUIRED
    if (!rules.validate) {
      formattedRules.validate = requiredFunc
    } else if (rules.validate instanceof Function) {
      const formattedValidate = { validationFunc: rules.validate, requiredFunc }
      formattedRules.validate = { ...formattedValidate }
    } else if (Utils.isObject(rules.validate)) {
      formattedRules.validate = { ...formattedRules.validate, requiredFunc }
    }
  }

  const textValue = defaultValue?.number
  const selectValue =
    defaultValue?.unit?.value || placeholder?.unit?.value || selectPlaceholder
  const textPlaceholder = placeholder?.number
  const isRequiredInRules = Object.values(rules).includes(
    FORM_VALIDATIONS.REQUIRED
  )
  return (
    <Controller
      name={name}
      isClearable
      rules={formattedRules}
      defaultValue={{ textValue, selectValue }}
      control={control}
      shouldUnregister
      render={({ field, fieldState: { error } }) => {
        const classes = clsx({
          disabled,
          [wrapperClass]: true,
          'has-error': !!error,
          'control-text-select-wrapper': true,
          'field-container': true
        })

        return (
          <div className={classes}>
            <span className='text-select-label field-1-label-content'>
              {label}
              {isRequiredInRules && !disabled && (
                <span className='required-star'>*</span>
              )}
              {!!info && (
                <Tooltip data={info}>
                  <Info />
                </Tooltip>
              )}
            </span>
            <TextBox
              onChange={(newValue) => {
                onChange?.(newValue)
                field.onChange({
                  textValue: newValue,
                  selectValue: field.value?.selectValue
                })
              }}
              value={field.value?.textValue}
              placeholder={textPlaceholder}
              type={textType}
              allowDecimal={allowDecimal}
              disabled={disabled}
            />
            <div className='spread-line' />
            <Select
              onChange={(newValue) => {
                onChange?.(newValue)
                field.onChange({
                  selectValue: newValue,
                  textValue: field.value?.textValue
                })
              }}
              value={field.value?.selectValue}
              options={options}
              disabled={disabled}
            />
            {!!error && !hideError && (
              <span className='text-select-error capitalize-first-letter'>
                {error.message}
              </span>
            )}
          </div>
        )
      }}
    />
  )
}

export default ControlTextSelectBox
