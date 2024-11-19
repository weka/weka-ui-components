import React, { useState } from 'react'
import clsx from 'clsx'
import Button from '../../../Button'
import { DateTime } from 'luxon'
import NumInput from '../NumInput'
import { TIME_PARTS } from '~consts'

import './TimeSelector.scss'

interface TimeSelectorProps {
  time: DateTime
  onSubmit: (val?: any) => void
  onNowSubmit: (val?: any) => void
  showSeconds?: boolean
  showNow?: boolean
}

function TimeSelector(props: TimeSelectorProps) {
  const {
    time,
    onSubmit,
    showSeconds = true,
    onNowSubmit,
    showNow = true
  } = props
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
        {showNow && (
          <Button
            extraClass='time-selector-now-btn'
            onClick={() => onNowSubmit(DateTime.now())}
          >
            Now
          </Button>
        )}
        <NumInput
          value={hours}
          max={23}
          numTitle={TIME_PARTS.HOUR}
          initialNumState={initialNumState}
          numFocus={numFocus}
          setNumFocus={setNumFocus}
          onChange={(val) => {
            if (!Number.isNaN(val)) {
              setHours(val)
              doValidate(TIME_PARTS.HOUR, val)
            }
          }}
        />
        <NumInput
          value={minutes}
          max={59}
          numTitle={TIME_PARTS.MINUTE}
          initialNumState={initialNumState}
          numFocus={numFocus}
          setNumFocus={setNumFocus}
          onChange={(val) => {
            if (!Number.isNaN(val)) {
              setMinutes(val)
              doValidate(TIME_PARTS.MINUTE, val)
            }
          }}
        />
        {showSeconds && (
          <NumInput
            value={seconds}
            max={59}
            numTitle={TIME_PARTS.SECOND}
            initialNumState={initialNumState}
            numFocus={numFocus}
            setNumFocus={setNumFocus}
            onChange={(val) => {
              if (!Number.isNaN(val)) {
                setSeconds(val)
                doValidate(TIME_PARTS.SECOND, val)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

export default TimeSelector
