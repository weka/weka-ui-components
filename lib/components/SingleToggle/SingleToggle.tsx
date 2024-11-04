import React, { ChangeEvent } from 'react'
import clsx from 'clsx'
import Tooltip from '../Tooltip'

import './singleToggle.scss'

export interface SingleToggleProps {
  isEnabled: boolean
  onChange: (newValue: ChangeEvent<HTMLInputElement>) => void
  enabledText?: string
  disabledText?: string
  tooltip?: string
  isToggleDisabled?: boolean
}

function SingleToggle({
  isEnabled,
  onChange,
  enabledText = 'Enabled',
  disabledText = 'Disabled',
  tooltip,
  isToggleDisabled = false,
  ...rest
}: SingleToggleProps) {
  function onClick(val: ChangeEvent<HTMLInputElement>) {
    if (!isToggleDisabled) {
      onChange(val)
    }
  }

  return (
    <Tooltip data={tooltip}>
      <div
        className={clsx({
          'single-toggle': true,
          'single-toggle-enabled': isEnabled,
          'single-toggle-btn-disabled': isToggleDisabled
        })}
      >
        <input
          type='checkbox'
          checked={isEnabled}
          onChange={(e) => {
            e.stopPropagation()
            onClick(e)
          }}
          {...rest}
        />
        <span className='label-8'>
          {isEnabled ? enabledText : disabledText}
        </span>
      </div>
    </Tooltip>
  )
}

export default SingleToggle
