import React from 'react'
import UptimeCell from './UptimeCell'

const UptimeCellWrapper = (props) => <UptimeCell {...props} />

export default React.memo(UptimeCellWrapper)
