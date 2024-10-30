import React from 'react'
import { useToggle } from '../../hooks'
import clsx from 'clsx'
import Tooltip from '../Tooltip'

import './singleToggle.scss'

export interface SingleToggleProps {
  isEnabled: boolean
  enabledText?: string
  disabledText?: string
  tooltip?: string
}

function SingleToggle({
  isEnabled,
  enabledText = 'Enabled',
  disabledText = 'Disabled',
  tooltip
}: SingleToggleProps) {
  const [enabled, toggleEnabled] = useToggle(isEnabled)
  return (
    <Tooltip data={tooltip}>
      <div
        className={clsx({
          'single-toggle': true,
          'single-toggle-enabled': enabled
        })}
        onClick={toggleEnabled}
      >
        <span className='label-8'>{enabled ? enabledText : disabledText}</span>
      </div>
    </Tooltip>
  )
}

export default SingleToggle
