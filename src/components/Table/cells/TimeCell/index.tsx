import React from 'react'
import TimeCell from './TimeCell'

const TimeCellWrapper = (props) => <TimeCell {...props} />

export default React.memo(TimeCellWrapper)
