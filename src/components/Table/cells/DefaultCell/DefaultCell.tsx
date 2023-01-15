import React, { useRef, useState, useEffect } from 'react'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'
import Utils from '../../../../utils'
import { CustomCellProps } from '../../Table'

import './defaultCell.scss'

function DefaultCell({ cell }: CustomCellProps) {
  const { value } = cell
  const ref = useRef<null | HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState(EMPTY_STRING)

  const compareSize = () => {
    if (ref.current && Utils.isEllipsisActive(ref.current)) {
      setTooltip(value)
    } else {
      setTooltip(EMPTY_STRING)
    }
  }

  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [value])

  return (
    <Tooltip data={tooltip?.toString()}>
      <div className='table-default-cell' ref={ref}>
        {value}
      </div>
    </Tooltip>
  )
}

export default DefaultCell
