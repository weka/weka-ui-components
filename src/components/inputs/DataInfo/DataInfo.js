import React from 'react'
import propTypes from 'prop-types'

import './dataInfo.scss'

function DataInfo(props) {
  const { label, value } = props
  return (
    <div className='data-info'>
      <div className='data-info-label'>
        {label}
      </div>
      <span className='data-info-value body-copy-1'>
        {value}
      </span>
    </div>
  )
}

DataInfo.propTypes = {
  label: propTypes.string.isRequired,
  value: propTypes.string.isRequired
}

export default DataInfo
