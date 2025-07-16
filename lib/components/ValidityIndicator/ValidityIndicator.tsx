import React from 'react'
import clsx from 'clsx'
import svgs from 'svgs'

import './validityIndicator.scss'

const { CheckmarkSmall } = svgs

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
