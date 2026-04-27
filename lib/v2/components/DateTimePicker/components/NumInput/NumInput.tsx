import type { ChangeEvent, MouseEvent } from 'react'

import { ARROW_DIRECTIONS, ArrowIcon } from '../../../../icons'
import { EMPTY_STRING, NOOP } from '../../../../utils/consts'

import styles from './numInput.module.scss'

const PAD_THRESHOLD = 10
const RADIX = 10

export interface NumFocusState {
  hour: boolean
  minute: boolean
  second: boolean
  [key: string]: boolean
}

const DEFAULT_NUM_FOCUS_STATE: NumFocusState = {
  hour: false,
  minute: false,
  second: false
}

export interface NumInputProps {
  max: number
  value: number
  onChange?: (val?: number) => void
  numTitle?: string
  numFocus?: NumFocusState
  setNumFocus?: (state: NumFocusState) => void
  initialNumState?: NumFocusState
}

export function NumInput({
  max,
  value,
  onChange = NOOP,
  numTitle = EMPTY_STRING,
  initialNumState = DEFAULT_NUM_FOCUS_STATE,
  numFocus = DEFAULT_NUM_FOCUS_STATE,
  setNumFocus = NOOP
}: Readonly<NumInputProps>) {
  const numInputClasses = numFocus[numTitle]
    ? styles.numInputControllerActive
    : styles.numInputController

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valAsNum = parseInt(e.target.value, RADIX)
    const formattedVal = valAsNum > max ? max : valAsNum
    onChange(formattedVal)
  }

  const preventDoubleClick = (e: MouseEvent) => {
    if (e.detail > 1) {
      e.preventDefault()
    }
  }

  return (
    <div
      className={numInputClasses}
      onBlur={() => setNumFocus(initialNumState)}
      tabIndex={0}
      onFocus={() => {
        setNumFocus({ ...initialNumState, [numTitle]: true })
      }}
    >
      <input
        max={max}
        min='0'
        onChange={handleInputChange}
        onFocus={(e) => e.target.select()}
        type='number'
        value={value < PAD_THRESHOLD ? `0${value}` : value}
      />
      <div className={styles.arrowButtons}>
        <button
          className={styles.arrowBtn}
          onClick={() => onChange((value + max + 2) % (max + 1))}
          onMouseDown={preventDoubleClick}
          type='button'
        >
          <ArrowIcon direction={ARROW_DIRECTIONS.DOWN} />
        </button>
        <button
          className={styles.arrowBtn}
          onClick={() => onChange((value + max) % (max + 1))}
          onMouseDown={preventDoubleClick}
          type='button'
        >
          <ArrowIcon direction={ARROW_DIRECTIONS.UP} />
        </button>
      </div>
    </div>
  )
}
