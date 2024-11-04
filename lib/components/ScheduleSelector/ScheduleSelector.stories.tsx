import React, { useState, FC, useCallback } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import ScheduleSelector from './ScheduleSelector'

import { Select } from '../inputs'
import Utils from '../../utils'
import { TextEditor } from '../index'
import { ScheduleData } from './types'
import { SCHEDULER_TYPES } from './ScheduleSelectorConsts'

const initialScheduleData: ScheduleData = {
  daily: {
    days: 'all',
    time: '22:05'
  },
  hourly: {
    hours: '09, 10, 11, 12, 13, 14, 15, 16, 17, 18',
    minuteOffset: 5
  },
  monthly: {
    days: '07',
    months: 'all',
    time: '00:05'
  },
  periodic: {
    days: 'monday, tuesday, wednesday, thursday, friday',
    end_time: '18:00',
    interval: 30,
    start_time: '09:00'
  },
  weekly: {
    days: 'saturday',
    time: '23:05'
  }
}

interface ScheduleTypeSelectorProps {
  onChange: (val: string) => void
  value: string
}

const ScheduleTypeSelector: FC<ScheduleTypeSelectorProps> = ({
  onChange,
  value
}) => {
  const options = [
    SCHEDULER_TYPES.PERIODIC,
    SCHEDULER_TYPES.DAILY,
    SCHEDULER_TYPES.HOURLY,
    SCHEDULER_TYPES.MONTHLY,
    SCHEDULER_TYPES.WEEKLY
  ]

  return (
    <Select
      onChange={(val) => onChange(val)}
      options={options.map(Utils.formatStringOption)}
      value={value}
    />
  )
}

export default {
  title: 'Components/ScheduleSelector',
  component: ScheduleSelector,
  argTypes: {
    type: { control: 'text' },
    scheduleData: { control: 'object' },
    isDisabled: { control: 'boolean' },
    onChange: { action: 'changed' }
  }
} as Meta

const Template: StoryFn = (args) => {
  const [type, setType] = useState<string>(SCHEDULER_TYPES.PERIODIC)
  const [scheduleData, setScheduleData] = useState(initialScheduleData)

  const handleTypeChange = useCallback((newType: string) => {
    setType(newType)
  }, [])

  const handleDataChange = useCallback((type: string, updatedData: any) => {
    setScheduleData((prevData) => ({
      ...prevData,
      [type]: updatedData
    }))
  }, [])

  return (
    <div style={{ maxWidth: '885px' }}>
      <h4>Select Schedule Type:</h4>
      <div style={{ marginBottom: '20px' }}>
        <ScheduleTypeSelector onChange={handleTypeChange} value={type} />
      </div>
      <div style={{ minHeight: '80px' }}>
        <ScheduleSelector
          type={type}
          scheduleData={scheduleData}
          onChange={handleDataChange}
          isDisabled={args.isDisabled}
        />
      </div>
      <div style={{ height: '600px', display: 'flex', paddingTop: '10px' }}>
        <TextEditor value={JSON.stringify(scheduleData, null, 2)} readOnly />
      </div>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  isDisabled: false,
  scheduleData: initialScheduleData
}
