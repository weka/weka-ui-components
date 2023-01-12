import React from 'react'
import CapacityCell from './CapacityCell'

const CapacityCellWrapper = (props) => <CapacityCell {...props} />

export default React.memo(CapacityCellWrapper)
