import React, { useRef, useState, useEffect } from 'react'
import Tooltip from '../../../Tooltip'
import { COLUMN_RESIZING_LISTENER, EMPTY_STRING } from '../../../../consts'
import Utils from '../../../../utils'
import { CustomCellProps } from '../../Table'
import { Link } from 'react-router-dom'

import './defaultCell.scss'

function DefaultCell({ cell }: CustomCellProps) {
  const { value, column, row } = cell
  const { isLink, getUrl, openInNewTab } = column
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
    document.addEventListener(COLUMN_RESIZING_LISTENER, compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
      document.removeEventListener(COLUMN_RESIZING_LISTENER, compareSize)
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
        <Link
          to={getUrl(row.original)}
          className='table-link'
          {...(openInNewTab && {
            target: '_blank',
            rel: 'noopener noreferrer'
          })}
        >
          {cellContent}
        </Link>
      ) : (
        cellContent
      )}
    </Tooltip>
  )
}

export default DefaultCell
