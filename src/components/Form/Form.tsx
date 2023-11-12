import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller, FormProvider, useFormContext, useWatch } from 'react-hook-form'
import clsx from 'clsx'
import { pickBy } from 'lodash'
import Button from '../Button'
import {
  TextField,
  FormSwitch,
  TextBox,
  TagsBox,
  Select,
  IpSubnetTextBox,
  LoginField,
  TextSelectBox,
  IpTextBox,
  TextArea,
  IpRangeTextBox
} from '../inputs'
import ShowMore from '../ShowMore'
import Utils from '../../utils'
import { EMPTY_STRING, FORM_INPUTS, FORM_VALIDATIONS } from '../../consts'
import useToggle from '../../hooks/useToggle'
import DateTimePicker from '../DateTimePicker'

import './form.scss'

function getInputType(type) {
  const inputsTypes = {
    [FORM_INPUTS.LOGIN_FIELD]: LoginField,
    [FORM_INPUTS.TEXT_FIELD]: TextField,
    [FORM_INPUTS.TEXT_BOX]: TextBox,
    [FORM_INPUTS.TAGS_BOX]: TagsBox,
    [FORM_INPUTS.SELECT]: Select,
    [FORM_INPUTS.SWITCH]: FormSwitch,
    [FORM_INPUTS.TEXT_SELECT]: TextSelectBox,
    [FORM_INPUTS.IP_TEXT_BOX]: IpTextBox,
    [FORM_INPUTS.IP_SUBNET_TEXT_BOX]: IpSubnetTextBox,
    [FORM_INPUTS.IP_RANGE_TEXT_BOX]: IpRangeTextBox,
    [FORM_INPUTS.TEXT_AREA]: TextArea,
    [FORM_INPUTS.DATE_PICKER]: DateTimePicker
  }
  return inputsTypes[type]
}

function getValidations(validations, getValues) {
  const validationTypes = {
    [FORM_VALIDATIONS.REQUIRED]: (value) => (Utils.isEmpty(value) ? 'required' : false),
    [FORM_VALIDATIONS.NOT_NEGATIVE]: (value) => (value < 0 ? 'Can`t be Negative' : false),
    [FORM_VALIDATIONS.POSITIVE]: (value) => (value < 1 ? 'Must be greater than 0' : false)
  }

  if (Utils.isEmpty(validations)) {
    return () => true
  }
  return (value) => {
    let error = EMPTY_STRING
    validations.forEach((validation) => {
      let validMessage = EMPTY_STRING
      if (Utils.isString(validation)) {
        validMessage = validationTypes[validation](value)
      } else if (validation instanceof Function) {
        validMessage = validation(value)
      } else if (Utils.isObject(validation)) {
        const { dependField, checkFunction } = validation
        validMessage = checkFunction(value, getValues()[dependField])
      }
      if (validMessage && !error) {
        error = validMessage
      }
    })
    return error || true
  }
}

function startWatchAndReturnHide({ checkHide, changeValue, field }, control) {
  const { setValue } = useFormContext()
  const values = useWatch({ control })
  if (checkHide && checkHide(values)) {
    return true
  }
  if (changeValue) {
    const newValue = changeValue(values)
    if (newValue !== undefined && newValue !== values[field]) {
      setTimeout(() => setValue(field, newValue), 1)
    }
  }
  return false
}

function getPlaceholder(placeHolders, keys, getValues, field) {
  if (Utils.isEmpty(placeHolders)) {
    return null
  }
  const watchValue = getValues(placeHolders.key)
  if (Utils.isEmpty(keys)) {
    return placeHolders.placeholders?.[watchValue]?.[field]
  }
  return Utils.getNestedValueByString(placeHolders.placeholders?.[watchValue], keys)
}

function ParseInput({ input, index }) {
  const { control, getValues, placeHolders } = useFormContext()
  const { inputComponent, defaultValue, checkHide, changeValue, field, placeholder, placeholderKeys, ...restInput } = input
  const InputComponent = getInputType(inputComponent)
  const validationFunction = getValidations(input.validations, getValues)
  const shouldHide = startWatchAndReturnHide({ checkHide, changeValue, field }, control)
  return (!shouldHide
    && (
      <Controller
        name={input.field}
        isClearable
        rules={{ validate: validationFunction }}
        defaultValue={defaultValue}
        control={control}
        shouldUnregister
        render={({ field: formField, fieldState: { error } }) => (
          <div className='field-container'>
            <InputComponent
              {...restInput}
              placeholder={placeholder
              || (Utils.isEmpty(changeValue) ? getPlaceholder(placeHolders, placeholderKeys, getValues, input.field) : EMPTY_STRING)}
              onChange={formField.onChange}
              value={formField.value}
              error={error?.message}
              isRequired={input.validations?.includes(FORM_VALIDATIONS.REQUIRED)}
              autoFocus={index === 0}
            />
          </div>
        )}
      />
    ))
}

function FormSection({ section, mainIndex }) {
  const { control, getValues, setValue } = useFormContext()
  const { inputs, title, toggle, watchOn } = section
  const [isClose, toggleSection] = useToggle(true)
  const cls = clsx({
    'form-section': true,
    'has-title': title
  })
  if (watchOn) {
    const watchValue = useWatch({ control, name: watchOn.key, defaultValue: getValues()[watchOn.key] })
    if (watchValue !== watchOn.value) {
      return null
    }
    inputs.forEach(({ field, defaultValue }) => {
      const currVal = getValues()[field]
      if (currVal !== defaultValue) {
        setTimeout(() => setValue(field, defaultValue), 1)
      }
    })
  }

  return (
    <div className={cls}>
      <span className='heading-4'>
        {toggle ? <ShowMore isClose={isClose} onClick={toggleSection} /> : null}
        {title}
      </span>
      {(!toggle || !isClose) && (
        <div className='form-section-body'>
          {inputs.map((input, index) => <ParseInput key={input.key || input.field} input={input} index={mainIndex + index} />)}
        </div>
      )}
    </div>
  )
}

function clearEmptyStringAndExe(values, func) {
  const sanitizedValues = pickBy(values, (value) => value !== EMPTY_STRING)
  return func(sanitizedValues)
}

// function watchAndSetPlaceHolders(defaultPlaceholders, watch) {
//   if (Utils.isEmpty(defaultPlaceholders)) {
//     return {}
//   }
//   const watchValue = watch(defaultPlaceholders.key)
//   return defaultPlaceholders.placeholders[watchValue]
// }

function ReactForm(props) {
  const {
    inputs,
    submitText,
    onSubmit,
    onCancel,
    showCancel,
    showSubmit,
    cancelText,
    defaultPlaceholders,
    onValidate,
    defaultValues
  } = props
  const formMethods = useForm({ defaultValues })
  const [isClickLoading, setClickLoading] = useState(false)
  const [isValidLoading, setValidLoading] = useState(false)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  // const placeHolders = watchAndSetPlaceHolders(defaultPlaceholders, formMethods.watch)
  return (
    <FormProvider {...formMethods} placeHolders={defaultPlaceholders}>
      <form
        className='form'
        onSubmit={(e) => {
          e.preventDefault()
          formMethods.handleSubmit((values) => {
            setClickLoading(true)
            return clearEmptyStringAndExe(values, onSubmit)
              .finally(() => {
                if (mounted.current) {
                  setClickLoading(false)
                }
              })
          })()
        }}
      >
        {inputs.map((input, index) => {
          if (input.inputComponent === FORM_INPUTS.INPUTS_SECTION) {
            return <FormSection key={input.key} section={input} mainIndex={index} />
          }
          return <ParseInput key={input.key || input.field} input={input} index={index} />
        })}
        <div className='dialog-actions'>
          {showCancel
          && (
            <Button empty onClick={onCancel}>
              {cancelText || 'Close'}
            </Button>
          )}
          {onValidate
          && (
            <Button
              empty
              isLoading={isValidLoading}
              onClick={formMethods.handleSubmit((values) => {
                setValidLoading(true)
                return clearEmptyStringAndExe(values, onValidate)
                  .finally(() => setValidLoading(false))
              })}
            >
              Validate
            </Button>
          )}
          {showSubmit
          && (
            <Button type='submit' isLoading={isClickLoading}>
              {submitText || 'Save'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}

export default ReactForm
