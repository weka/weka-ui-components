import React, { useRef, useState, useEffect } from 'react'
import propTypes from 'prop-types'
import { Tooltip } from '@weka.io/weka-ui-components'
import { EMPTY_STRING } from '../../../../utils/consts'
import Utils from '../../../../utils/utils'

import './defaultCell.scss'

function DefaultCell({ cell }) {
  const { value } = cell
  const ref = useRef(null)
  const [tooltip, setTooltip] = useState(EMPTY_STRING)

  const compareSize = () => {
    if (Utils.isEllipsisActive(ref.current)) {
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

DefaultCell.propTypes = { cell: propTypes.object.isRequired }

export default DefaultCell
