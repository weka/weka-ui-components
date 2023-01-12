import React from 'react'
import propTypes from 'prop-types'

import './progressCell.scss'

function ProgressCell({ cell }) {
  const { value } = cell
  const { status, progress } = value
  const stringToShow = progress !== 'N/A' ? `${status} - ${progress}` : status
  return (
    <div className='progress-cell'>
      {stringToShow}
    </div>
  )
}

ProgressCell.propTypes = { cell: propTypes.object.isRequired }

export default ProgressCell
