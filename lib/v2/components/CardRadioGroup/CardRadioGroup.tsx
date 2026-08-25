import type { RadioValue } from '../inputs/RadioGroup'
import type { KeyboardEvent } from 'react'

import { useId, useRef } from 'react'
import clsx from 'clsx'

import { KEYBOARD_KEYS } from '#v2/utils/consts'

import { resolveArrowKeyIndex } from './cardRadioGroup.utils'
import { CardRadioOptionContent } from './CardRadioOptionContent'

import styles from './cardRadioGroup.module.scss'

export interface CardRadioOption<TValue extends RadioValue = string> {
  value: TValue
  title: string
  description?: string
  /** Right-aligned note shown when the option can't be picked (e.g. "Already replicated"). */
  note?: string
  /** Disables just this card, independent of the group-level `disabled` prop. */
  disabled?: boolean
}

export const CARD_RADIO_GROUP_ORIENTATIONS = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
} as const

export type CardRadioGroupOrientation =
  (typeof CARD_RADIO_GROUP_ORIENTATIONS)[keyof typeof CARD_RADIO_GROUP_ORIENTATIONS]

export interface CardRadioGroupProps<TValue extends RadioValue = string> {
  value: TValue
  onChange: (value: TValue) => void
  options: CardRadioOption<TValue>[]
  /** Disables the whole group (individual options can also opt out via `disabled`). */
  disabled?: boolean
  /** Id prefix for the generated per-option aria ids; auto-generated (stable) when omitted. */
  name?: string
  /** `horizontal` (default) flows cards into a wrapping row; `vertical` stacks them one per row, each full-width. */
  orientation?: CardRadioGroupOrientation
  /** Announces the group's purpose to screen readers when no visible label precedes it. */
  ariaLabel?: string
  extraClass?: string
}

/**
 * An accessible card-style radio group: each option renders as a bordered,
 * clickable card with a title and description shown together, instead of a
 * native radio input. Supports the standard `radiogroup` roving-tabindex
 * keyboard pattern (arrow keys, Home/End, Space/Enter to select).
 */
export function CardRadioGroup<TValue extends RadioValue = string>({
  value,
  onChange,
  options,
  disabled = false,
  name,
  orientation = CARD_RADIO_GROUP_ORIENTATIONS.HORIZONTAL,
  ariaLabel,
  extraClass
}: Readonly<CardRadioGroupProps<TValue>>) {
  const generatedId = useId()
  const baseId = name ?? generatedId
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const selectedIndex = options.findIndex((option) => option.value === value)
  const focusableIndex = selectedIndex === -1 ? 0 : selectedIndex

  function selectAndFocus(index: number) {
    if (disabled || options[index].disabled) {
      return
    }
    onChange(options[index].value)
    cardRefs.current[index]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    if (
      event.key === KEYBOARD_KEYS.SPACE ||
      event.key === KEYBOARD_KEYS.ENTER
    ) {
      event.preventDefault()
      selectAndFocus(index)
      return
    }
    const nextIndex = resolveArrowKeyIndex(event.key, index, options.length)
    if (nextIndex !== undefined) {
      event.preventDefault()
      selectAndFocus(nextIndex)
    }
  }

  return (
    <div
      aria-label={ariaLabel}
      role='radiogroup'
      className={clsx(
        styles.group,
        orientation === CARD_RADIO_GROUP_ORIENTATIONS.VERTICAL &&
          styles.vertical,
        extraClass
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value
        const isOptionDisabled = disabled || Boolean(option.disabled)
        const titleId = `${baseId}-title-${index}`
        const descriptionId = option.description
          ? `${baseId}-description-${index}`
          : undefined
        return (
          <div
            key={String(option.value)}
            ref={(node) => {
              cardRefs.current[index] = node
            }}
            aria-checked={isSelected}
            aria-describedby={descriptionId}
            aria-disabled={isOptionDisabled}
            aria-labelledby={titleId}
            onClick={() => selectAndFocus(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            role='radio'
            tabIndex={isOptionDisabled || index !== focusableIndex ? -1 : 0}
            className={clsx(
              styles.card,
              isSelected && styles.selected,
              isOptionDisabled && styles.disabled
            )}
          >
            <CardRadioOptionContent
              descriptionId={descriptionId}
              isSelected={isSelected}
              option={option}
              titleId={titleId}
              isVertical={
                orientation === CARD_RADIO_GROUP_ORIENTATIONS.VERTICAL
              }
            />
          </div>
        )
      })}
    </div>
  )
}
