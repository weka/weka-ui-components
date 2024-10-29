import React from 'react'

import './timePicker.scss'

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
  isDisabled?: boolean
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  isDisabled
}) => {
  return (
    <div className='timePicker-wrapper'>
      <input
        type='time'
        value={value}
        disabled={isDisabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default TimePicker
