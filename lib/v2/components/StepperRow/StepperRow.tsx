import clsx from 'clsx'

import { CheckIcon } from '../../icons'

import styles from './stepperRow.module.scss'

/* Same glyph-true checkmark size the Stepper uses — see its comment on the design asset's internal padding. */
const CHECK_ICON_WIDTH = 13
const CHECK_ICON_HEIGHT = 10

export const STEPPER_ROW_STATES = {
  PENDING: 'pending',
  RUNNING: 'running',
  DONE: 'done'
} as const

export type StepperRowState =
  (typeof STEPPER_ROW_STATES)[keyof typeof STEPPER_ROW_STATES]

export interface StepperRowProps {
  stepNumber: number
  label: string
  description?: string
  state?: StepperRowState
  /** Right-aligned status text (e.g. "Done", "Running", "Pending"); omit to hide it. */
  stateLabel?: string
  extraClass?: string
}

/** One row of a vertical setup/progress list: status indicator, label/description, right-aligned state text. */
export function StepperRow({
  stepNumber,
  label,
  description,
  state = STEPPER_ROW_STATES.PENDING,
  stateLabel,
  extraClass
}: Readonly<StepperRowProps>) {
  const isDone = state === STEPPER_ROW_STATES.DONE
  const isRunning = state === STEPPER_ROW_STATES.RUNNING

  return (
    <div className={clsx(styles.row, extraClass)}>
      <div
        className={clsx(styles.indicator, {
          [styles.indicatorDone]: isDone,
          [styles.indicatorRunning]: isRunning
        })}
      >
        {isDone ? (
          <CheckIcon
            color='var(--gray-0)'
            height={CHECK_ICON_HEIGHT}
            width={CHECK_ICON_WIDTH}
          />
        ) : null}
        {!isDone && !isRunning ? stepNumber : null}
      </div>
      <div className={styles.text}>
        <span
          className={clsx(styles.label, {
            [styles.labelActive]: isDone || isRunning
          })}
        >
          {label}
        </span>
        {description ? (
          <span className={styles.description}>{description}</span>
        ) : null}
      </div>
      {stateLabel ? (
        <span
          className={clsx(styles.stateLabel, {
            [styles.stateLabelDone]: isDone,
            [styles.stateLabelRunning]: isRunning
          })}
        >
          {stateLabel}
        </span>
      ) : null}
    </div>
  )
}
