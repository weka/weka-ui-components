import React from 'react'
import EmptyPageMessage from './EmptyPageMessage'

const EmptyPageMessageWrapper = (props) => <EmptyPageMessage {...props} />

export default React.memo(EmptyPageMessageWrapper)
