import { useState } from 'react'
import { DateTime } from 'luxon'

import { TIME_PARTS } from '../../../../utils/consts'
import { Button } from '../../../Button'
import { clampDateTime } from '../../utils/dateTimeUtils'
import { NumInput } from '../NumInput'

import styles from './timeSelector.module.scss'

const MAX_HOUR = 23
const MAX_MIN_SEC = 59

export interface TimeSelectorProps {
  time: DateTime
  onSubmit: (val: DateTime) => void
  onNowSubmit: (val: DateTime) => void
  showSeconds?: boolean
  showNow?: boolean
  minDate?: DateTime | null
  maxDate?: DateTime | null
}

export function TimeSelector({
  time,
  onSubmit,
  showSeconds = true,
  onNowSubmit,
  showNow = true,
  minDate = null,
  maxDate = null
}: Readonly<TimeSelectorProps>) {
  const initialNumState = {
    hour: false,
    minute: false,
    second: false
  }
  const [numFocus, setNumFocus] = useState(initialNumState)

  const [hours, setHours] = useState(time?.hour ?? 0)
  const [minutes, setMinutes] = useState(time?.minute ?? 0)
  const [seconds, setSeconds] = useState(time?.second ?? 0)

  const doValidate = (key: string, value: number) => {
    const setOfTime = { hour: hours, minute: minutes, second: seconds }
    const newDateTime = time.set({ ...setOfTime, [key]: value })
    const clampedDateTime = clampDateTime(newDateTime, minDate, maxDate)

    if (clampedDateTime !== newDateTime) {
      setHours(clampedDateTime.hour ?? 0)
      setMinutes(clampedDateTime.minute ?? 0)
      setSeconds(clampedDateTime.second ?? 0)
    }

    onSubmit(clampedDateTime)
  }

  const dateTimeClasses = !showSeconds
    ? styles.datetimeTimeHourMinOnly
    : styles.datetimeTime

  const timeSelectorClasses = !showNow
    ? styles.timeSelectorNoNow
    : styles.timeSelector

  return (
    <div className={dateTimeClasses}>
      <div className={timeSelectorClasses}>
        {showNow ? (
          <Button
            extraClass={styles.timeSelectorNowBtn}
            onClick={() => onNowSubmit(DateTime.now())}
          >
            Now
          </Button>
        ) : null}
        <NumInput
          initialNumState={initialNumState}
          max={MAX_HOUR}
          numFocus={numFocus}
          numTitle={TIME_PARTS.HOUR}
          setNumFocus={setNumFocus}
          value={hours}
          onChange={(val) => {
            if (val !== undefined && !Number.isNaN(val)) {
              setHours(val)
              doValidate(TIME_PARTS.HOUR, val)
            }
          }}
        />
        <NumInput
          initialNumState={initialNumState}
          max={MAX_MIN_SEC}
          numFocus={numFocus}
          numTitle={TIME_PARTS.MINUTE}
          setNumFocus={setNumFocus}
          value={minutes}
          onChange={(val) => {
            if (val !== undefined && !Number.isNaN(val)) {
              setMinutes(val)
              doValidate(TIME_PARTS.MINUTE, val)
            }
          }}
        />
        {showSeconds ? (
          <NumInput
            initialNumState={initialNumState}
            max={MAX_MIN_SEC}
            numFocus={numFocus}
            numTitle={TIME_PARTS.SECOND}
            setNumFocus={setNumFocus}
            value={seconds}
            onChange={(val) => {
              if (val !== undefined && !Number.isNaN(val)) {
                setSeconds(val)
                doValidate(TIME_PARTS.SECOND, val)
              }
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
