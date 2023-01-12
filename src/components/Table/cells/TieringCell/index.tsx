import React from 'react'
import TieringCell from './TieringCell'

const TieringCellWrapper = (props) => <TieringCell {...props} />

export default React.memo(TieringCellWrapper)
