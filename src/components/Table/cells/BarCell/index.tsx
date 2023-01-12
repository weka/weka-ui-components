import React from 'react'
import BarCell from './BarCell'

const BarCellWrapper = (props) => <BarCell {...props} />

export default React.memo(BarCellWrapper)
