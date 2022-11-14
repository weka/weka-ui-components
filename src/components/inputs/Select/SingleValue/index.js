import React from 'react'
import SingleValue from './SingleValue'

const SingleValueWrapper = (props) => <SingleValue {...props} />

export default React.memo(SingleValueWrapper)
