import React from 'react'
import SeverityFilter from './SeverityFilter'

const SeverityFilterWrapper: typeof SeverityFilter = (props) => <SeverityFilter {...props} />

export default React.memo(SeverityFilterWrapper)
