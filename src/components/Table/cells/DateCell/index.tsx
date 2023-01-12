import React from 'react'
import DateCell from './DateCell'

const DateCellWrapper = (props) => <DateCell {...props} />

export default React.memo(DateCellWrapper)
