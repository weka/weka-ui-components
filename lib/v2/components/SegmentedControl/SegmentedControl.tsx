import clsx from 'clsx'

import styles from './segmentedControl.module.scss'

export interface SegmentedControlOption {
  value: string
  label: string
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[]
  value: string
  onChange: (value: string) => void
  extraClass?: string
  dataTestId?: string
}

/**
 * A compact segmented button group for picking one option from a small set
 * (e.g. a 1H/1D/7D time-range toggle). Prop-only and controlled: the caller
 * owns `value` and handles `onChange`.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  extraClass,
  dataTestId
}: Readonly<SegmentedControlProps>) {
  return (
    <div
      className={clsx(styles.segmentedControl, extraClass)}
      data-testid={dataTestId}
    >
      {options.map((option) => (
        <button
          key={option.value}
          data-testid={dataTestId ? `${dataTestId}-${option.value}` : undefined}
          onClick={() => onChange(option.value)}
          className={clsx(
            styles.option,
            value === option.value && styles.active
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
