import React from 'react'
import BlocksCell from './BlocksCell'

const BlocksCellWrapper = (props) => <BlocksCell {...props} />

export default React.memo(BlocksCellWrapper)
