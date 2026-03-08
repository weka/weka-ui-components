import React, { useEffect, useRef, useState } from 'react'
import type { OptionProps } from 'react-select'
import { components } from 'react-select'

import { EMPTY_STRING } from 'consts'

import Tooltip from '../../../Tooltip'

import './selectOption.scss'

interface SelectOptionProps extends OptionProps {
  data: {
    label: string
    icon?: React.ReactNode
    tooltip?: string
    subLabel?: string
  }
}

function SelectOption(props: SelectOptionProps) {
  const {
    data: { label, icon, tooltip, subLabel }
  } = props

  const labelRef = useRef<HTMLDivElement | null>(null)
  const subLabelRef = useRef<HTMLDivElement | null>(null)

  const [isLabelOverflowing, setIsLabelOverflowing] = useState(false)
  const [isSubLabelOverflowing, setIsSubLabelOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = (element: HTMLDivElement | null) =>
      element ? element.scrollWidth > element.clientWidth : false

    setIsLabelOverflowing(checkOverflow(labelRef.current))
    setIsSubLabelOverflowing(checkOverflow(subLabelRef.current))
  }, [label, subLabel])

  return (
    <components.Option
      {...props}
      className={icon ? 'has-icon' : EMPTY_STRING}
    >
      <Tooltip
        data={tooltip || (isLabelOverflowing ? label : null)}
        extraClass='option-tooltip'
      >
        <div className='option-wrapper'>
          {icon ? <div className='icon-wrapper'>{icon}</div> : null}
          <div className='label-wrapper'>
            <Tooltip
              data={isLabelOverflowing ? label : null}
              extraClass='option-tooltip'
            >
              <div
                ref={labelRef}
                className='main-label'
              >
                {label}
              </div>
            </Tooltip>
            {subLabel ? (
              <Tooltip
                data={isSubLabelOverflowing ? subLabel : null}
                extraClass='option-tooltip'
              >
                <div
                  ref={subLabelRef}
                  className='label-4 sub-label'
                >
                  {subLabel}
                </div>
              </Tooltip>
            ) : null}
          </div>
        </div>
      </Tooltip>
    </components.Option>
  )
}

export default SelectOption
