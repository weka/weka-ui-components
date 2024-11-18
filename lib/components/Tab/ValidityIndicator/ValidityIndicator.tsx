import React from 'react'
import clsx from 'clsx'
import { CheckmarkSmall } from 'svgs'

import './validityIndicator.scss'

interface ValidityIndicatorProps {
  invalidFieldsLength: number
}

function ValidityIndicator({ invalidFieldsLength }: ValidityIndicatorProps) {
  return (
    <div
      className={clsx({
        ['validity-indicator']: true,
        ['validity-indicator-valid']: !invalidFieldsLength,
        ['validity-indicator-invalid']: invalidFieldsLength
      })}
    >
      <span className='validity-indicator-content'>
        {!invalidFieldsLength ? <CheckmarkSmall /> : invalidFieldsLength}
      </span>
    </div>
  )
}

export default ValidityIndicator
