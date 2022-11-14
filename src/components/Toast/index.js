import React from 'react'
import Toast from './Toast'

const ToastWrapper = (props) => <Toast {...props} />

export default React.memo(ToastWrapper)
