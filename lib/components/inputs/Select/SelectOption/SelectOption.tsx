import React, { useRef, useState, useEffect } from 'react'
import { components, OptionProps } from 'react-select'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from 'consts'

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
    <components.Option {...props} className={icon ? 'has-icon' : EMPTY_STRING}>
      <Tooltip
        extraClass='option-tooltip'
        data={tooltip || (isLabelOverflowing ? label : null)}
      >
        <div className='option-wrapper'>
          {icon && <div className='icon-wrapper'>{icon}</div>}
          <div className='label-wrapper'>
            <Tooltip
              extraClass='option-tooltip'
              data={isLabelOverflowing ? label : null}
            >
              <div ref={labelRef} className='main-label'>
                {label}
              </div>
            </Tooltip>
            {subLabel && (
              <Tooltip
                extraClass='option-tooltip'
                data={isSubLabelOverflowing ? subLabel : null}
              >
                <div ref={subLabelRef} className='label-4 sub-label'>
                  {subLabel}
                </div>
              </Tooltip>
            )}
          </div>
        </div>
      </Tooltip>
    </components.Option>
  )
}

export default SelectOption
