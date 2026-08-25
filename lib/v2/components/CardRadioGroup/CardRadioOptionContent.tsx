import type { RadioValue } from '../inputs/RadioGroup'
import type { CardRadioOption } from './CardRadioGroup'

import clsx from 'clsx'

import styles from './cardRadioGroup.module.scss'

export interface CardRadioOptionContentProps<TValue extends RadioValue> {
  option: CardRadioOption<TValue>
  isSelected: boolean
  isVertical: boolean
  titleId: string
  descriptionId: string | undefined
}

/**
 * The vertical orientation renders as a flat list row (a decorative radio
 * dot, inline title/description, a spacer pushing `note` to the right edge)
 * instead of the horizontal orientation's stacked card content.
 */
export function CardRadioOptionContent<TValue extends RadioValue>({
  option,
  isSelected,
  isVertical,
  titleId,
  descriptionId
}: Readonly<CardRadioOptionContentProps<TValue>>) {
  return (
    <>
      {isVertical ? (
        <span
          aria-hidden
          className={clsx(
            styles.radioCircle,
            isSelected && styles.radioCircleSelected
          )}
        >
          {isSelected ? <span className={styles.radioDot} /> : null}
        </span>
      ) : null}
      <span
        className={styles.title}
        id={titleId}
      >
        {option.title}
      </span>
      {option.description ? (
        <span
          className={styles.description}
          id={descriptionId}
        >
          {option.description}
        </span>
      ) : null}
      {isVertical ? <span className={styles.spacer} /> : null}
      {option.note ? <span className={styles.note}>{option.note}</span> : null}
    </>
  )
}
