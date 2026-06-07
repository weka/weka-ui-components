import type { CapacityUnit } from '../capacityRangeFilterTypes'
import type { RefObject } from 'react'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

import { SIZES_BASE2, SIZES_BASE10 } from '#v2/utils/capacityUtils'
import { DOM_EVENTS, EMPTY_STRING } from '#v2/utils/consts'

import { ChevronDownSmallIcon } from '../../../../icons'
import { NumberInput } from '../../../inputs/NumberInput'

import styles from './range.module.scss'

const MIN_MAX = {
  MIN: 'min',
  MAX: 'max'
} as const

type MinMaxType = (typeof MIN_MAX)[keyof typeof MIN_MAX]

export interface MinMaxCapacityRaw {
  min?: { value: number; unit: CapacityUnit }
  max?: { value: number; unit: CapacityUnit }
}

interface RangeProps {
  values: MinMaxCapacityRaw
  onChange: (values: MinMaxCapacityRaw) => void
  unitOptions: CapacityUnit[]
}

function Range({ values, onChange, unitOptions }: Readonly<RangeProps>) {
  const { min, max } = values

  const defaultCapacityOption =
    unitOptions.find(
      ({ label }) => label === SIZES_BASE2.GiB || label === SIZES_BASE10.GB
    ) ?? unitOptions[0]
  const [isMinDropdownOpen, setIsMinDropdownOpen] = useState(false)
  const [isMaxDropdownOpen, setIsMaxDropdownOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{
    top: number
    left: number
    width: number
  } | null>(null)
  const [minUnit, setMinUnit] = useState(min?.unit || defaultCapacityOption)
  const [minValue, setMinValue] = useState(min?.value ?? EMPTY_STRING)
  const [maxUnit, setMaxUnit] = useState(max?.unit || defaultCapacityOption)
  const [maxValue, setMaxValue] = useState(max?.value ?? EMPTY_STRING)

  const minDropdownRef = useRef<HTMLDivElement>(null)
  const maxDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        minDropdownRef.current &&
        !minDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMinDropdownOpen(false)
      }
      if (
        maxDropdownRef.current &&
        !maxDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMaxDropdownOpen(false)
      }
    }

    document.addEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)
    return () =>
      document.removeEventListener(DOM_EVENTS.MOUSEDOWN, handleClickOutside)
  }, [])

  const handleValueChange = (
    newValue: string,
    unit: CapacityUnit,
    updateKey: string,
    updateFunc: (value: string) => void
  ) => {
    updateFunc(newValue)
    if (newValue !== EMPTY_STRING && !Number.isNaN(Number(newValue))) {
      onChange({
        ...values,
        [updateKey]: { value: Number(newValue), unit }
      })
    } else {
      onChange({ ...values, [updateKey]: undefined })
    }
  }

  const handleUnitChange = (unit: CapacityUnit, type: MinMaxType) => {
    if (type === MIN_MAX.MIN) {
      setMinUnit(unit)
      if (minValue !== EMPTY_STRING && !Number.isNaN(Number(minValue))) {
        onChange({ ...values, min: { value: Number(minValue), unit } })
      }
    } else {
      setMaxUnit(unit)
      if (maxValue !== EMPTY_STRING && !Number.isNaN(Number(maxValue))) {
        onChange({ ...values, max: { value: Number(maxValue), unit } })
      }
    }
  }

  const renderUnitDropdown = (
    type: MinMaxType,
    isOpen: boolean,
    setDropdownOpen: (open: boolean) => void,
    ref: RefObject<HTMLDivElement>
  ) => {
    const unitToShow = type === MIN_MAX.MAX ? maxUnit : minUnit
    const isMin = type === MIN_MAX.MIN
    const buttonLabel = `Select unit for ${
      isMin ? 'minimum' : 'maximum'
    } capacity`
    const menuLabel = `${isMin ? 'Minimum' : 'Maximum'} capacity unit options`

    const toggleDropdown = () => {
      const nextOpen = !isOpen
      if (nextOpen && ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setMenuPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        })
      }
      setDropdownOpen(nextOpen)
    }

    return (
      <div
        ref={ref}
        className={styles.unitDropdownContainer}
      >
        <button
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-label={buttonLabel}
          onClick={toggleDropdown}
          type='button'
          className={clsx(styles.unitDropdown, {
            [styles.unitDropdownOpen]: isOpen
          })}
        >
          {unitToShow.label}
          <ChevronDownSmallIcon
            extraClass={clsx(styles.dropdownArrow, {
              [styles.dropdownArrowUp]: isOpen
            })}
          />
        </button>
        {isOpen ? (
          <div
            aria-label={menuLabel}
            className={styles.unitDropdownMenu}
            role='listbox'
            style={menuPosition ?? undefined}
          >
            {unitOptions.map((unit) => (
              <button
                key={unit.value}
                aria-label={`Select ${unit.label} as unit`}
                aria-selected={unit.label === unitToShow.label}
                role='option'
                type='button'
                className={clsx(styles.unitOption, {
                  [styles.unitOptionSelected]: unit.label === unitToShow.label
                })}
                onClick={() => {
                  handleUnitChange(unit, type)
                  setDropdownOpen(false)
                }}
              >
                {unit.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <>
      <div className={styles.rangeSection}>
        <label
          className={styles.inputLabel}
          htmlFor='capacityRangeMinInput'
        >
          Min.
        </label>
        <div className={styles.inputGroup}>
          <NumberInput
            dataTestId='capacity-range-min-input'
            id='capacityRangeMinInput'
            name='capacityRangeMin'
            value={minValue}
            onChange={(val) =>
              handleValueChange(val, minUnit, MIN_MAX.MIN, setMinValue)
            }
          />
          {renderUnitDropdown(
            MIN_MAX.MIN,
            isMinDropdownOpen,
            setIsMinDropdownOpen,
            minDropdownRef
          )}
        </div>
      </div>
      <div className={styles.rangeSection}>
        <label
          className={styles.inputLabel}
          htmlFor='capacityRangeMaxInput'
        >
          Max.
        </label>
        <div className={styles.inputGroup}>
          <NumberInput
            dataTestId='capacity-range-max-input'
            id='capacityRangeMaxInput'
            name='capacityRangeMax'
            value={maxValue}
            onChange={(val) =>
              handleValueChange(val, maxUnit, MIN_MAX.MAX, setMaxValue)
            }
          />
          {renderUnitDropdown(
            MIN_MAX.MAX,
            isMaxDropdownOpen,
            setIsMaxDropdownOpen,
            maxDropdownRef
          )}
        </div>
      </div>
    </>
  )
}

export default Range
