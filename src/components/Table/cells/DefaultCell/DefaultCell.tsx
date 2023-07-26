import React, { useRef, useState, useEffect } from 'react'
import Tooltip from '../../../Tooltip'
import { EMPTY_STRING } from '../../../../consts'
import Utils from '../../../../utils'
import { CustomCellProps } from '../../Table'
import { Link } from 'react-router-dom'

import './defaultCell.scss'

function DefaultCell({ cell }: CustomCellProps) {
  const { value, column, row } = cell
  const { isLink, getUrl } = column
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

  const cellContent = (
    <div className='table-default-cell' ref={ref}>
      {value}
    </div>
  )

  return (
    <Tooltip data={tooltip?.toString()}>
      {isLink && getUrl ? (
        <Link to={getUrl(row.original)} className='table-link'>
          {cellContent}
        </Link>
      ) : (
        cellContent
      )}
    </Tooltip>
  )
}

export default DefaultCell
