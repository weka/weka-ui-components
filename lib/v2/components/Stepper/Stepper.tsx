import clsx from 'clsx'

import { CheckIcon, CloseIcon } from '../../icons'

import styles from './stepper.module.scss'

/*
 * The design's 16px checkmark asset carries internal padding — the drawn
 * glyph is only ~13x10 — while CheckIcon's glyph fills its whole 4:3
 * viewBox, so it renders at the glyph's true size (a 16x16 box would draw
 * it oversized and vertically stretched).
 */
const CHECK_ICON_WIDTH = 13
const CHECK_ICON_HEIGHT = 10
const ERROR_ICON_SIZE = 16
const ERROR_ICON_STROKE_WIDTH = 2

export const STEPPER_ORIENTATIONS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
} as const

export type StepperOrientation =
  (typeof STEPPER_ORIENTATIONS)[keyof typeof STEPPER_ORIENTATIONS]

export interface StepperStep {
  label: string
  /** Marks the step as failed: a red indicator with an X replaces the number/checkmark, whatever the step's position. */
  hasError?: boolean
}

export interface StepperProps {
  steps: StepperStep[]
  currentIndex: number
  orientation?: StepperOrientation
  extraClass?: string
}

/**
 * A non-interactive numbered step rail: a checkmark for completed steps, a
 * highlighted indicator for the current step, plain numbers for the rest,
 * and a red X for a step flagged with `hasError`. Purely a progress
 * indicator — steps aren't clickable.
 */
export function Stepper({
  steps,
  currentIndex,
  orientation = STEPPER_ORIENTATIONS.VERTICAL,
  extraClass
}: Readonly<StepperProps>) {
  return (
    <ol className={clsx(styles.rail, styles[orientation], extraClass)}>
      {steps.map((step, index) => {
        const hasError = Boolean(step.hasError)
        const isDone = !hasError && index < currentIndex
        const isCurrent = index === currentIndex
        return (
          <li
            key={index}
            aria-current={isCurrent ? 'step' : undefined}
            className={clsx(styles.step, isCurrent && styles.current)}
          >
            <span
              className={clsx(
                styles.indicator,
                isDone && styles.indicatorDone,
                hasError && styles.indicatorError,
                !hasError && isCurrent && styles.indicatorCurrent
              )}
            >
              {renderIndicatorContent(hasError, isDone, index)}
            </span>
            <span className={styles.label}>{step.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

function renderIndicatorContent(
  hasError: boolean,
  isDone: boolean,
  index: number
) {
  if (hasError) {
    return (
      <CloseIcon
        color='var(--gray-0)'
        height={ERROR_ICON_SIZE}
        strokeWidth={ERROR_ICON_STROKE_WIDTH}
        width={ERROR_ICON_SIZE}
      />
    )
  }
  if (isDone) {
    return (
      <CheckIcon
        color='var(--gray-0)'
        height={CHECK_ICON_HEIGHT}
        width={CHECK_ICON_WIDTH}
      />
    )
  }
  return <>{index + 1}</>
}
