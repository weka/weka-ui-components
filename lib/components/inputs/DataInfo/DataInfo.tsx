import React from 'react'

import './dataInfo.scss'

interface DataInfoProps {
  label: string
  value: string
}
function DataInfo(props: DataInfoProps) {
  const { label, value } = props
  return (
    <div className='data-info'>
      <div className='data-info-label'>{label}</div>
      <span className='data-info-value body-copy-1'>{value}</span>
    </div>
  )
}

export default DataInfo
