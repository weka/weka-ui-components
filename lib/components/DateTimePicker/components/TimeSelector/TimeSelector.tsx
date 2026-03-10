import React, { useState } from 'react'
import clsx from 'clsx'
import { DateTime } from 'luxon'

import { TIME_PARTS } from 'consts'

import Button from '../../../Button'
import NumInput from '../NumInput'

import './TimeSelector.scss'

interface TimeSelectorProps {
  time: DateTime
  onSubmit: (val?: any) => void
  onNowSubmit: (val?: any) => void
  showSeconds?: boolean
  showNow?: boolean
}

function TimeSelector({
  time,
  onSubmit,
  showSeconds = true,
  onNowSubmit,
  showNow = true
}: TimeSelectorProps) {
  const initialNumState = {
    hour: false,
    minute: false,
    second: false
  }
  const [numFocus, setNumFocus] = useState(initialNumState)

  const [hours, setHours] = useState(time ? time.hour : 0)
  const [minutes, setMinutes] = useState(time ? time.minute : 0)
  const [seconds, setSeconds] = useState(time ? time.second : 0)

  function doValidate(key: string, value) {
    const setOfTime = { hour: hours, minute: minutes, second: seconds }
    onSubmit(time.set({ ...setOfTime, [key]: value }))
  }

  const dateTimeClasses = clsx({
    'datetime-time': true,
    'datetime-time-hour-min-only': !showSeconds
  })

  const timeSelectorClasses = clsx({
    'time-selector': true,
    'time-selector-no-now': !showNow
  })

  return (
    <div className={dateTimeClasses}>
      <div className={timeSelectorClasses}>
        {showNow ? (
          <Button
            extraClass='time-selector-now-btn'
            onClick={() => onNowSubmit(DateTime.now())}
          >
            Now
          </Button>
        ) : null}
        <NumInput
          initialNumState={initialNumState}
          max={23}
          numFocus={numFocus}
          numTitle={TIME_PARTS.HOUR}
          setNumFocus={setNumFocus}
          value={hours}
          onChange={(val) => {
            if (!Number.isNaN(val)) {
              setHours(val)
              doValidate(TIME_PARTS.HOUR, val)
            }
          }}
        />
        <NumInput
          initialNumState={initialNumState}
          max={59}
          numFocus={numFocus}
          numTitle={TIME_PARTS.MINUTE}
          setNumFocus={setNumFocus}
          value={minutes}
          onChange={(val) => {
            if (!Number.isNaN(val)) {
              setMinutes(val)
              doValidate(TIME_PARTS.MINUTE, val)
            }
          }}
        />
        {showSeconds ? (
          <NumInput
            initialNumState={initialNumState}
            max={59}
            numFocus={numFocus}
            numTitle={TIME_PARTS.SECOND}
            setNumFocus={setNumFocus}
            value={seconds}
            onChange={(val) => {
              if (!Number.isNaN(val)) {
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

export default TimeSelector
