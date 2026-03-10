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
}) => (
  <div className='timePicker-wrapper'>
    <input
      disabled={isDisabled}
      onChange={(e) => onChange(e.target.value)}
      type='time'
      value={value}
    />
  </div>
)

export default TimePicker
