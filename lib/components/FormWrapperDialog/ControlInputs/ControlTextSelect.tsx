import React from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import clsx from 'clsx'

import { EMPTY_STRING, FORM_VALIDATIONS } from 'consts'
import svgs from 'svgs'
import Utils from 'utils'

import Select from '../../inputs/Select'
import TextBox from '../../inputs/TextBox'
import Tooltip from '../../Tooltip'

import './controlInputs.scss'

const { Info } = svgs

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

function ControlTextSelectBox({
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
}: ControlTextSelectBoxProps) {
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
      control={control}
      defaultValue={{ textValue, selectValue }}
      isClearable
      name={name}
      rules={formattedRules}
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
              {isRequiredInRules && !disabled ? (
                <span className='required-star'>*</span>
              ) : null}
              {!!info && (
                <Tooltip data={info}>
                  <Info />
                </Tooltip>
              )}
            </span>
            <TextBox
              allowDecimal={allowDecimal}
              disabled={disabled}
              placeholder={textPlaceholder}
              type={textType}
              value={field.value?.textValue}
              onChange={(newValue) => {
                onChange?.(newValue)
                field.onChange({
                  textValue: newValue,
                  selectValue: field.value?.selectValue
                })
              }}
            />
            <div className='spread-line' />
            <Select
              disabled={disabled}
              options={options}
              value={field.value?.selectValue}
              onChange={(newValue) => {
                onChange?.(newValue)
                field.onChange({
                  selectValue: newValue,
                  textValue: field.value?.textValue
                })
              }}
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
