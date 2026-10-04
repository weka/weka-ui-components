import { EMPTY_STRING } from '#v2/utils/consts'

import { NumberInput } from '../NumberInput'
import { Select } from '../Select'

export interface CapacityAmountUnitOption {
  label: string
  value: number
}

export interface CapacityAmountValue {
  number: number | undefined
  unit: {
    label: string | undefined
    value: number | undefined
  }
}

export interface CapacityAmountInputProps {
  value: CapacityAmountValue
  onChange: (value: CapacityAmountValue) => void
  unitOptions: CapacityAmountUnitOption[]
  disabled?: boolean
  allowDecimal?: boolean
  placeholder?: string
  id?: string
  label?: string
  numberFieldClassName?: string
  unitFieldClassName?: string
  hideUnitSelect?: boolean
  showArrows?: boolean
}

/**
 * Form-library-agnostic number + unit-selector pair that composes a
 * {@link CapacityAmountValue}. Controlled: the caller owns the value and
 * receives every edit through `onChange`, so it can bind to react-hook-form,
 * local state, or anything else.
 */
export function CapacityAmountInput({
  value,
  onChange,
  unitOptions,
  disabled,
  allowDecimal,
  placeholder,
  id,
  label,
  numberFieldClassName,
  unitFieldClassName,
  hideUnitSelect,
  showArrows
}: Readonly<CapacityAmountInputProps>) {
  const handleNumberChange = (rawNumber: string | number) => {
    const parsedNumber =
      rawNumber === EMPTY_STRING ||
      rawNumber === undefined ||
      rawNumber === null
        ? undefined
        : Number(rawNumber)
    onChange({
      number: parsedNumber,
      unit: value.unit
    })
  }

  const handleUnitChange = (selectedValue: number | string) => {
    const normalizedValue =
      typeof selectedValue === 'string' ? Number(selectedValue) : selectedValue
    const selectedOption = unitOptions.find(
      (option) => option.value === normalizedValue
    )
    onChange({
      number: value.number,
      unit: selectedOption
        ? { label: selectedOption.label, value: selectedOption.value }
        : { label: undefined, value: undefined }
    })
  }

  return (
    <>
      <div className={numberFieldClassName}>
        <NumberInput
          disabled={disabled}
          id={id}
          label={label}
          onChange={handleNumberChange}
          placeholder={placeholder}
          showArrows={showArrows}
          step={allowDecimal ? undefined : 1}
          value={value.number !== undefined ? value.number : EMPTY_STRING}
        />
      </div>
      {hideUnitSelect ? null : (
        <div className={unitFieldClassName}>
          <Select
            disabled={disabled}
            onChange={handleUnitChange}
            options={unitOptions}
            value={value.unit?.value}
          />
        </div>
      )}
    </>
  )
}
